#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AuthStack } from "../lib/auth-stack";

const app = new cdk.App();

new AuthStack(app, "JobTrackerAuth", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  domainPrefix: "job-tracker-app",
  appUrl: "http://localhost:3000",
});
