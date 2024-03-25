import * as cdk from "aws-cdk-lib";
import {
  aws_certificatemanager,
  aws_cognito,
  aws_ec2,
  aws_ecr,
  aws_ecs,
  aws_ecs_patterns,
  aws_elasticloadbalancingv2,
  aws_iam,
  aws_secretsmanager,
  aws_rds,
  aws_route53,
  aws_route53_targets,
} from "aws-cdk-lib";
import { Construct } from "constructs";

interface BudgetAppProdStackProps extends cdk.StackProps {
  prodSecretManagerArn: string;
  topLevelDomain: string;
}

export class BudgetAppProdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BudgetAppProdStackProps) {
    super(scope, id, props);

    const { prodSecretManagerArn, topLevelDomain } = props;

    const secrets = aws_secretsmanager.Secret.fromSecretAttributes(
      this,
      "budgetapp-prod-secrets",
      {
        secretCompleteArn: prodSecretManagerArn,
      }
    );

    const vpc = new aws_ec2.Vpc(this, "budgetapp-prod-vpc", {
      ipAddresses: aws_ec2.IpAddresses.cidr("192.168.1.0/24"),
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 27,
          name: "budgetapp-prod-public",
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 27,
          name: "budgetapp-prod-private-egress",
          subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: "budgetapp-prod-private-isolated",
          subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    ////////////////////////////////////
    // Security group settings
    ////////////////////////////////////

    //Bastion instance security group; only allow AWS EC2 instance connect
    const bastionSecurityGroup = new aws_ec2.SecurityGroup(
      this,
      "budgetapp-prod-bastion-sg",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    bastionSecurityGroup.addIngressRule(
      aws_ec2.Peer.ipv4("3.112.23.0/29"),
      aws_ec2.Port.tcp(22),
      "Allow SSH from EC2 instance connect in Tokyo"
    );

    const frontendLoadBalancerSecurityGroup = new aws_ec2.SecurityGroup(
      this,
      "budgetapp-prod-frontend-alb-sg",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    frontendLoadBalancerSecurityGroup.addIngressRule(
      aws_ec2.Peer.anyIpv4(),
      aws_ec2.Port.tcp(80),
      "Allow HTTP traffic"
    );
    frontendLoadBalancerSecurityGroup.addIngressRule(
      aws_ec2.Peer.anyIpv4(),
      aws_ec2.Port.tcp(443),
      "Allow HTTPS traffic"
    );

    const frontendECSTaskSecurityGroup = new aws_ec2.SecurityGroup(
      this,
      "budgetapp-prod-frontend-ecs-sg",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    frontendECSTaskSecurityGroup.addIngressRule(
      frontendLoadBalancerSecurityGroup,
      aws_ec2.Port.tcp(3000),
      "Allow traffic from frontend load balancer"
    );

    const backendLoadBalancerSecurityGroup = new aws_ec2.SecurityGroup(
      this,
      "budgetapp-prod-backend-nlb-sg",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    backendLoadBalancerSecurityGroup.addIngressRule(
      frontendECSTaskSecurityGroup,
      aws_ec2.Port.tcp(443),
      "Allow traffic from frontend"
    );

    const backendECSTaskSecurityGroup = new aws_ec2.SecurityGroup(
      this,
      "budgetapp-prod-backend-ecs-sg",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    backendECSTaskSecurityGroup.addIngressRule(
      backendLoadBalancerSecurityGroup,
      aws_ec2.Port.tcp(5000),
      "Allow traffic from backend load balancer"
    );

    //MySQL instance security group; allow traffic only from bastionSecurityGroup
    const dbSecurityGroup = new aws_ec2.SecurityGroup(
      this,
      "budgetapp-prod-db-sg",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    dbSecurityGroup.addIngressRule(
      bastionSecurityGroup,
      aws_ec2.Port.tcp(3306),
      "Allow MySQL access from bastion"
    );
    dbSecurityGroup.addIngressRule(
      backendECSTaskSecurityGroup,
      aws_ec2.Port.tcp(3306),
      "Allow MySQL access from backend"
    );

    ////////////////////////////////////
    // Bastion settings
    ////////////////////////////////////

    //Bastion instance
    const instance = new aws_ec2.Instance(this, "budgetapp-prod-bastion", {
      instanceType: aws_ec2.InstanceType.of(
        aws_ec2.InstanceClass.T2,
        aws_ec2.InstanceSize.MICRO
      ),
      machineImage: aws_ec2.MachineImage.latestAmazonLinux2(),
      vpc,
      vpcSubnets: { subnetType: aws_ec2.SubnetType.PUBLIC },
      securityGroup: bastionSecurityGroup,
    });

    ////////////////////////////////////
    // AWS Certificate Manager settings
    ////////////////////////////////////

    const hostedZone = aws_route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: topLevelDomain,
    });

    //create certificate with subdomain 'budgetapp'
    const certificate = new aws_certificatemanager.Certificate(
      this,
      "budgetapp-prod-certificate",
      {
        domainName: `budgetapp.${topLevelDomain}`,
        certificateName: `budgetapp.${topLevelDomain}`,
        subjectAlternativeNames: [
          `www.budgetapp.${topLevelDomain}`,
          `api.budgetapp.${topLevelDomain}`,
          `www.api.budgetapp.${topLevelDomain}`,
        ],
        validation:
          aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
      }
    );

    ////////////////////////////////////
    // RDS DB settings
    ////////////////////////////////////

    //MySQL instance
    const db = new aws_rds.DatabaseCluster(this, "budgetapp-prod-db", {
      engine: aws_rds.DatabaseClusterEngine.auroraMysql({
        version: aws_rds.AuroraMysqlEngineVersion.VER_3_06_0,
      }),
      parameterGroup: aws_rds.ParameterGroup.fromParameterGroupName(
        this,
        "BudgetAppProdParameterGroup",
        "default.aurora-mysql8.0"
      ),
      defaultDatabaseName: "budgetapp",
      instances: 1,
      instanceProps: {
        instanceType: aws_ec2.InstanceType.of(
          aws_ec2.InstanceClass.T3,
          aws_ec2.InstanceSize.LARGE
        ),
        vpcSubnets: {
          subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
        vpc,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      credentials: {
        username: "user",
        password: secrets.secretValueFromJson("DB_PASSWORD"),
      },
      securityGroups: [dbSecurityGroup],
    });

    ////////////////////////////////////
    // Cognito settings
    ////////////////////////////////////

    const cognito = new aws_cognito.UserPool(this, "budgetapp-prod-userpool", {
      userPoolName: "budgetapp-prod-userpool",
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for our demo budget app",
        emailBody:
          "Thanks for signing up to our demo budget app! Your verification code is {####}",
        emailStyle: aws_cognito.VerificationEmailStyle.CODE,
        smsMessage:
          "Thanks for signing up to our demo budget app! Your verification code is {####}",
      },
      userInvitation: {
        emailSubject: "Invitation to our demo budget app",
        emailBody:
          "Hi {username}, you have been invited to join our demo budget app! Your temporary password is {####}",
      },
      signInAliases: {
        username: true,
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      autoVerify: { email: true },
      keepOriginal: {
        email: true,
      },
      accountRecovery: aws_cognito.AccountRecovery.EMAIL_ONLY,
    });

    const cognitoRole = new aws_iam.Role(this, "BudgetAppCognitoRole", {
      assumedBy: new aws_iam.ServicePrincipal("cognito-idp.amazonaws.com"),
    });

    cognito.grant(cognitoRole, "cognito-idp:AdminCreateUser");

    const appClient = new aws_cognito.UserPoolClient(
      this,
      "budgetapp-prod-userpool-client",
      {
        userPool: cognito,
        userPoolClientName: "budgetapp-prod-client",
        authFlows: {
          userPassword: true,
        },
        generateSecret: false,
      }
    );

    ////////////////////////////////////
    // ECR settings
    ////////////////////////////////////

    const frontendECR = new aws_ecr.Repository(
      this,
      "budgetapp-prod-frontend-ecr",
      {
        emptyOnDelete: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        repositoryName: "budgetapp-prod-frontend-ecr",
      }
    );
    frontendECR.addLifecycleRule({
      maxImageCount: 10,
    });

    const backendECR = new aws_ecr.Repository(
      this,
      "budgetapp-prod-backend-ecr",
      {
        emptyOnDelete: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        repositoryName: "budgetapp-prod-backend-ecr",
      }
    );
    backendECR.addLifecycleRule({
      maxImageCount: 10,
    });

    ////////////////////////////////////
    // ECS settings
    ////////////////////////////////////

    const ecsCluster = new aws_ecs.Cluster(this, "budgetapp-prod-ecs-cluster", {
      vpc,
      enableFargateCapacityProviders: true,
    });

    ////////////////////////////////////
    //// ECS task definitions
    ////////////////////////////////////

    const frontendTaskDefinition = new aws_ecs.FargateTaskDefinition(
      this,
      "budgetapp-prod-frontend-task-definition"
    );

    frontendTaskDefinition.addContainer("budgetapp-prod-frontend-container", {
      image: aws_ecs.ContainerImage.fromEcrRepository(frontendECR),
      portMappings: [{ containerPort: 3000 }],
      logging: new aws_ecs.AwsLogDriver({
        streamPrefix: "budgetapp-prod-frontend",
      }),
    });

    const backendTaskRole = new aws_iam.Role(this, "BudgetAppBackendTaskRole", {
      assumedBy: new aws_iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });
    backendTaskRole.addToPolicy(
      new aws_iam.PolicyStatement({
        actions: [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel",
          "ecs:ExecuteCommand",
        ],
        resources: ["*"],
      })
    );

    const backendTaskDefinition = new aws_ecs.FargateTaskDefinition(
      this,
      "budgetapp-prod-backend-task-definition",
      {
        taskRole: backendTaskRole,
      }
    );

    backendTaskDefinition.addContainer("budgetapp-prod-backend-container", {
      image: aws_ecs.ContainerImage.fromEcrRepository(backendECR),
      environment: {
        FLASK_ENV: "production",
        DB_HOSTNAME: db.clusterEndpoint.hostname,
        DB_USERNAME: "user",
        DB_PASSWORD: secrets.secretValueFromJson("DB_PASSWORD").unsafeUnwrap(),
        DB_NAME: "budgetapp",
        FRONTEND_URL: `https://budgetapp.${topLevelDomain}`,
        COGNITO_USER_POOL_ID: cognito.userPoolId,
        COGNITO_CLIENT_ID: appClient.userPoolClientId,
        AWS_DEFAULT_REGION: props.env?.region || "ap-northeast-1",
      },
      portMappings: [{ containerPort: 5000 }],
      logging: new aws_ecs.AwsLogDriver({
        streamPrefix: "budgetapp-prod-backend",
      }),
    });

    ////////////////////////////////////
    //// Services and load balancers - frontend
    ////////////////////////////////////

    const frontendLoadBalancer =
      new aws_elasticloadbalancingv2.ApplicationLoadBalancer(
        this,
        "budgetapp-prod-frontend-alb",
        {
          vpc,
          internetFacing: true,
          securityGroup: frontendLoadBalancerSecurityGroup,
        }
      );

    const frontendService =
      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "budgetapp-prod-frontend-service",
        {
          cluster: ecsCluster,
          taskDefinition: frontendTaskDefinition,
          desiredCount: 1,
          securityGroups: [frontendECSTaskSecurityGroup],
          loadBalancer: frontendLoadBalancer,
          certificate: certificate,
          redirectHTTP: true,
        }
      );

    frontendService.targetGroup.configureHealthCheck({
      path: "/login",
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 2,
    });

    ////////////////////////////////////
    //// Services and load balancers - backend
    ////////////////////////////////////

    const backendApplicationLoadBalancer =
      new aws_elasticloadbalancingv2.ApplicationLoadBalancer(
        this,
        "budgetapp-prod-backend-alb",
        {
          vpc,
          internetFacing: true,
          securityGroup: backendLoadBalancerSecurityGroup,
        }
      );

    const backendService =
      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "budgetapp-prod-backend-service",
        {
          cluster: ecsCluster,
          taskDefinition: backendTaskDefinition,
          desiredCount: 1,
          securityGroups: [backendECSTaskSecurityGroup],
          loadBalancer: backendApplicationLoadBalancer,
          certificate: certificate,
          redirectHTTP: true,
        }
      );

    backendService.targetGroup.configureHealthCheck({
      path: "/health/",
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 2,
    });

    ////////////////////////////////////
    // Route53 settings
    ////////////////////////////////////

    new aws_route53.ARecord(this, "budgetapp-prod-frontend-dns", {
      zone: hostedZone,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.LoadBalancerTarget(frontendService.loadBalancer)
      ),
      recordName: `budgetapp.${topLevelDomain}`,
    });
    new aws_route53.ARecord(this, "budgetapp-prod-frontend-www-dns", {
      zone: hostedZone,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.LoadBalancerTarget(frontendService.loadBalancer)
      ),
      recordName: `www.budgetapp.${topLevelDomain}`,
    });
    new aws_route53.ARecord(this, "budgetapp-prod-backend-dns", {
      zone: hostedZone,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.LoadBalancerTarget(backendService.loadBalancer)
      ),
      recordName: `api.budgetapp.${topLevelDomain}`,
    });
    new aws_route53.ARecord(this, "budgetapp-prod-backend-www-dns", {
      zone: hostedZone,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.LoadBalancerTarget(backendService.loadBalancer)
      ),
      recordName: `www.api.budgetapp.${topLevelDomain}`,
    });
  }
}
