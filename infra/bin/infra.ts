#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BudgetAppDevStack } from "../lib/budget-app-dev-stack";
import { BudgetAppProdStack } from "../lib/budget-app-prod-stack";

const env = { account: "", region: "" };

const app = new cdk.App();

const prodStackProps = {
  prodSecretManagerArn: "", // Pass the secret manager ARN here
  topLevelDomain: "", // Pass the top level domain here
  env,
};

new BudgetAppDevStack(app, "BudgetAppDevStack", {});

new BudgetAppProdStack(app, "BudgetAppProdStack", prodStackProps);
