#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BudgetAppDevStack } from "../lib/budget-app-dev-stack";
import { BudgetAppProdStack } from "../lib/budget-app-prod-stack";

const app = new cdk.App();

const prodStackProps = {
  prodSecretManagerArn: "your-arn-value", // Pass the secret manager ARN here
};

new BudgetAppDevStack(app, "BudgetAppDevStack", {});

new BudgetAppProdStack(app, "BudgetAppProdStack", prodStackProps);
