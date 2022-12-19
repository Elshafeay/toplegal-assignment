import { ICreateUser, IUserModel, IUserSerialized } from './user.interfaces';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import { boundMethod } from 'autobind-decorator';
import { documentClient } from '../../../config/database';
import * as uuid from 'uuid';
import { BadRequestError } from '../../errors/bad-request-error';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UserDefColumn } from './user.enums';

export class UserRepository {
  private readonly tableName = 'users';
  private documentClient: DocumentClient;
  private logger: ILogger;
  private flatColumns: UserDefColumn[];

  constructor(
  ) {
    this.logger = Logger;
    this.documentClient = documentClient;
    this.flatColumns = Object.values(UserDefColumn);
  }

  @boundMethod
  public async findOneById(userID: string): Promise<IUserSerialized|null>{
    const user = await this.documentClient.get({
      TableName: this.tableName,
      Key: {
        userID,
      },
    }).promise();

    return <IUserSerialized>user.Item || null;
  }

  @boundMethod
  public async findOneByEmail(email: string): Promise<IUserModel|null>{
    const user = await this.documentClient.scan({
      TableName: this.tableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }).promise();

    return user.Items?.length ? <IUserModel>user.Items[0]: null;
  }

  @boundMethod
  public async findAll(): Promise<IUserSerialized[]>{
    const users = await this.documentClient.scan({
      TableName: this.tableName,
      AttributesToGet: [
        ...this.flatColumns,
      ],
    }).promise();

    return <IUserSerialized[]>users.Items;
  }

  @boundMethod
  public async create(userData: ICreateUser): Promise<string>{
    const timestamp = new Date().toISOString();
    const userID = uuid.v4();

    const params = {
      TableName: this.tableName,
      Item: {
        userID,
        ...userData,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    const user = await this.documentClient.put(params).promise();

    if(!user){
      throw new BadRequestError('Something went wrong. Try again later!');
    }

    return userID;
  }
}

export default new UserRepository();