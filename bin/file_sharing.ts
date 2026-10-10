#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { DatabaseStack } from '../lib/database-stack';

const app = new cdk.App();

new PipelineStack(
  app,
  'FileSharingPipelineStack',
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  }
);

new DatabaseStack(
    app,
    'DatabaseStack',
    {
        env: {
              account: process.env.CDK_DEFAULT_ACCOUNT,
              region: process.env.CDK_DEFAULT_REGION,
        },
    }
);