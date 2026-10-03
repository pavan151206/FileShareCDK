import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

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

    const source =
      pipelines.CodePipelineSource.connection(
        'pavan151206/FileShareCDK',
        'main',
        {
          connectionArn: props.connectionArn,
        }
      );

    const pipeline =
      new pipelines.CodePipeline(
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
            }
          ),
        }
      );

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