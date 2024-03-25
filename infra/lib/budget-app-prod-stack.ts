import * as cdk from "aws-cdk-lib";
import { aws_cognito, aws_ec2, aws_rds, aws_secretsmanager } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface BudgetAppProdStackProps extends cdk.StackProps {
  prodSecretManagerArn: string;
}

export class BudgetAppProdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BudgetAppProdStackProps) {
    super(scope, id, props);

    const { prodSecretManagerArn } = props;

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

    //Bastion security group; only allow AWS Session Manager
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

    //MySql instance
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

    const cognitoRole = new Role(this, "BudgetAppCognitoRole", {
      assumedBy: new ServicePrincipal("cognito-idp.amazonaws.com"),
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
  }
}
