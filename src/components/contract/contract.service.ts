import { ICreateContract } from './contract.interfaces';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import contractRepositoryInstance, { ContractRepository } from './contract.repository';
import { boundMethod } from 'autobind-decorator';
import { NotFoundError } from '../../errors/not-found-error';

export class ContractService {
  private contractRepository: ContractRepository;
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
    this.contractRepository = contractRepositoryInstance;
  }

  @boundMethod
  public async createContract(dataObject: ICreateContract){
    return this.contractRepository.create({
      ...dataObject,
    });
  }

  @boundMethod
  public async getContracts(){
    return this.contractRepository.getContracts();
  }

  @boundMethod
  public async getContract(contractID: string){
    const contract = await this.contractRepository.getContract(contractID);
    if(!contract){
      throw new NotFoundError('No Contracts Found!');
    }
    return contract;
  }

}

export default new ContractService();