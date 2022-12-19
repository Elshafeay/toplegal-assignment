import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { documentClient } from '../../../config/database';

export class CommonRepository {
  documentClient: DocumentClient;

  constructor(
  ) {
    this.documentClient = documentClient;
  }

  public async dbTruncate(){
    /*
      This is how it supposed to be, but since we don't have a general HASH attribute name (i.e. id)
      we can't do this, So instead I'm gonna do it hardcoded
    */

    // const { TableNames } = await this.dynamodbClient.listTables().promise();
    // for(let TableName of TableNames || []){
    //   const { Items } = await this.dynamodbClient.scan({ TableName }).promise();
    //   for(let item of Items || []){
    //     this.dynamodbClient.deleteItem({ TableName, Key: { id: item.id } }).promise();
    //   }
    // }

    const tablesNames = ['contracts', 'users'];
    const { Items: contracts } = await this.documentClient
      .scan({ TableName: tablesNames[0] })
      .promise();
    for(let item of contracts || []){
      await this.documentClient
        .delete({ TableName: tablesNames[0], Key: { contractID: item.contractID } }).promise();
    }

    const { Items: users } = await this.documentClient
      .scan({ TableName: tablesNames[1] })
      .promise();
    for(let item of users || []){
      await this.documentClient
        .delete({ TableName: tablesNames[1], Key: { userID: item.userID } }).promise();
    }
  }
}

export default new CommonRepository();