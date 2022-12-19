import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import commonRepositoryInstance, { CommonRepository } from './common.repository';

export class CommonService {
  private commonRepository: CommonRepository;

  constructor(
  ) {
    this.commonRepository = commonRepositoryInstance;
  }

  async dbTruncate(){
    await this.commonRepository.dbTruncate();
  }
}

export default new CommonService();