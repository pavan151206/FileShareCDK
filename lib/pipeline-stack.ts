import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codeconnections from 'aws-cdk-lib/aws-codeconnections';

import { FileSharingStack } from './file_sharing-stack';

export class PipelineStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    /*
     * GitHub CodeConnections connection.
     *
     * This is created by CloudFormation/CDK.
     *
     * IMPORTANT:
     * The connection initially starts as PENDING.
     * You must complete the GitHub authorization once.
     */
    const githubConnection =
      new codeconnections.CfnConnection(
        this,
        'GitHubConnection',
        {
          connectionName:
            'FileSharingGitHubConnection',

          providerType: 'GitHub',
        }
      );

    /*
     * GitHub repository source.
     */
    const source =
      pipelines.CodePipelineSource.connection(
        'pavan151206/FileShareCDK',
        'main',
        {
          connectionArn:
            githubConnection.attrConnectionArn,

          triggerOnPush: true,
        }
      );

    /*
     * CDK Pipeline.
     */
    const pipeline =
      new pipelines.CodePipeline(
        this,
        'FileSharingPipeline',
        {
          pipelineName:
            'FileSharingPipeline',

          synth:
            new pipelines.ShellStep(
              'Synth',
              {
                input: source,

                commands: [
                  'npm ci',
                  'npm run build',
                  'npm test',
                  'npx cdk synth',
                ],

                primaryOutputDirectory:
                  'cdk.out',
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
     * Development deployment stage.
     */
    pipeline.addStage(
      new FileSharingStage(
        this,
        'Dev',
        {
          env: props?.env,
        }
      )
    );
  }
}

/**
 * Application stage.
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