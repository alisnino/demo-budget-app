import * as cdk from "aws-cdk-lib";
import { aws_cognito } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const devCognito = new aws_cognito.UserPool(
      this,
      "budgetapp-dev-userpool",
      {
        userPoolName: "budgetapp-dev-userpool",
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
      }
    );

    const cognitoRole = new Role(this, "BudgetAppCognitoRole", {
      assumedBy: new ServicePrincipal("cognito-idp.amazonaws.com"),
    });

    devCognito.grant(cognitoRole, "cognito-idp:AdminCreateUser"); // In case we ever need admin users
  }
}
