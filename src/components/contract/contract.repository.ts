import {
  ICreateContract,
  IContract,
  IGetContractsResult,
} from './contract.interfaces';
import { boundMethod } from 'autobind-decorator';
import { documentClient } from '../../../config/database';
import * as uuid from 'uuid';
import { BadRequestError } from '../../errors/bad-request-error';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class ContractRepository {
  private readonly tableName = 'contracts';
  private documentClient: DocumentClient;

  constructor(
  ) {
    this.documentClient = documentClient;
  }

  @boundMethod
  public async create(contractData: ICreateContract): Promise<string>{
    const timestamp = new Date().toISOString();
    const contractID = uuid.v4();

    const params = {
      TableName: this.tableName,
      Item: {
        contractID,
        ...contractData,
        signedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    const contract = await this.documentClient.put(params).promise();
    if(!contract){
      throw new BadRequestError('Couldn\'t create the Contract.');
    }

    return contractID;
  }

  @boundMethod
  public async getContracts(): Promise<IGetContractsResult[]>{
    const contracts = await this.documentClient.scan({
      TableName: this.tableName,
      AttributesToGet: [
        'contractID',
      ],
    }).promise();

    return <IGetContractsResult[]>contracts.Items;
  }

  @boundMethod
  public async getContract(contractID: string): Promise<IContract>{
    const contract = await this.documentClient.get({
      TableName: this.tableName,
      Key: {
        contractID,
      },
    }).promise();

    return <IContract>contract.Item || null;
  }

}

export default new ContractRepository();