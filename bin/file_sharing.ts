#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const connectionArn =
  app.node.tryGetContext('connectionArn');

if (!connectionArn) {
  throw new Error(
    'connectionArn is missing. Add it to cdk.json.'
  );
}

new PipelineStack(app, 'FileSharingPipelineStack', {
  connectionArn,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});