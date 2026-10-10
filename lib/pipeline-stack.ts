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
     * GitHub source
     *
     * The CodeConnections connection is created and authorized
     * outside CDK. CDK only references the existing ARN.
     */
    const source = pipelines.CodePipelineSource.connection(
      'pavan151206/FileShareCDK',
      'main',
      {
        connectionArn: props.connectionArn,

        // Automatically start the pipeline when main changes.
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
     * Application stage
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
 * Application infrastructure deployed by the pipeline.
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
      'FileSharing',
      {
        env: props?.env,
      }
    );
  }
}