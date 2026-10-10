import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class WeblabStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const experimentsTable = new dynamodb.Table(this, 'Dummy', {
      tableName: 'Dummy',

      partitionKey: {
        name: 'experimentId',
        type: dynamodb.AttributeType.STRING,
      },

      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

      encryption: dynamodb.TableEncryption.AWS_MANAGED,

      pointInTimeRecovery: true,

      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }
}