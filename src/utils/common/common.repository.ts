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

    const TableName = 'contracts';
    const { Items } = await this.documentClient.scan({ TableName }).promise();
    for(let item of Items || []){
      await this.documentClient
        .delete({ TableName, Key: { contractID: item.contractID } }).promise();
    }
  }
}

export default new CommonRepository();