import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

import { FileSharingStack } from './file_sharing-stack';

export interface PipelineStackProps extends cdk.StackProps {
  connectionArn: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: PipelineStackProps
  ) {
    super(scope, id, props);

    /*
     * GitHub source through AWS CodeConnections.
     *
     * The connection ARN must point to a GitHub
     * connection that was authorized using the
     * AWS Connector for GitHub App.
     */
    const source = pipelines.CodePipelineSource.connection(
      'pavan151206/FileShareCDK',
      'main',
      {
        connectionArn: props.connectionArn,

        // Start pipeline when a commit is pushed to main.
        triggerOnPush: true,
      }
    );

    /*
     * CDK Pipeline
     */
    const pipeline = new pipelines.CodePipeline(
      this,
      'FileSharingPipeline',
      {
        pipelineName: 'FileSharingPipeline',

        synth: new pipelines.ShellStep(
          'Synth',
          {
            input: source,

            commands: [
              'npm ci',
              'npm run build',
              'npm test',
              'npx cdk synth',
            ],

            primaryOutputDirectory: 'cdk.out',
          }
        ),

        synthCodeBuildDefaults: {
          buildEnvironment: {
            buildImage:
              codebuild.LinuxBuildImage.STANDARD_7_0,
          },
        },
      }
    );

    /*
     * Deployment stage
     */
    pipeline.addStage(
      new FileSharingStage(
        this,
        'Dev',
        {
          env: props.env,
        }
      )
    );
  }
}

/*
 * Application stage
 */
class FileSharingStage extends cdk.Stage {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StageProps
  ) {
    super(scope, id, props);

    new FileSharingStack(
      this,
      'FileSharing'
    );
  }
}
