#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';

import { PipelineStack } from '../lib/pipeline-stack';
import { DatabaseStack } from '../lib/database-stack';

const app = new cdk.App();

/*
 * Get the already-authorized GitHub CodeConnections ARN.
 *
 * This connection should NOT be created by CDK.
 */
const connectionArn =
  app.node.tryGetContext('connectionArn');

if (!connectionArn) {
  throw new Error(
    'connectionArn is required. Add it to cdk.json. hello da '
  );
}

/*
 * Pipeline
 */
new PipelineStack(
  app,
  'FileSharingPipelineStack',
  {
    connectionArn,

    env: {
      account:
        process.env.CDK_DEFAULT_ACCOUNT,

      region:
        process.env.CDK_DEFAULT_REGION,
    },
  }
);

/*
 * Database infrastructure
 */
new DatabaseStack(
  app,
  'DatabaseStack',
  {
    env: {
      account:
        process.env.CDK_DEFAULT_ACCOUNT,

      region:
        process.env.CDK_DEFAULT_REGION,
    },
  }
);