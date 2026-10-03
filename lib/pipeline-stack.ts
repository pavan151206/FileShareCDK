
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codeconnections from
  'aws-cdk-lib/aws-codeconnections';

import { FileSharingStack } from './file_sharing-stack';

export interface PipelineStackProps
  extends cdk.StackProps {
  connectionArn: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: PipelineStackProps
  ) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(
      this,
      'FileSharingPipeline',
      {
        pipelineName: 'FileSharingPipeline',

        synth: new pipelines.ShellStep('Synth', {
          input: pipelines.CodePipelineSource
            .connection(
              'pavan151206/FileShareCDK',
              'main',
              {
                connectionArn: props.connectionArn,
              }
            ),

          commands: [
            'npm ci',
            'npm run build',
            'npm test -- --runInBand',
            'npx cdk synth',
          ],
        }),
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
