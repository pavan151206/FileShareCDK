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

const dummyTable = new dynamodb.Table(this, 'DummyV2', {
      tableName: 'DummyV2',

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

const dummyTableV2 = new dynamodb.Table(this, 'DummyV3', {
      tableName: 'DummyV3',

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