import CustomResponse from '../../utils/custom-response';
import contractServiceInstance, { ContractService } from './contract.service';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import { boundMethod } from 'autobind-decorator';

class ContractController {
  private logger: ILogger;
  private contractService: ContractService;

  constructor(
  ) {
    this.logger = Logger;
    this.contractService = contractServiceInstance;
  }

  @boundMethod
  public async createContract(req: any, res: any){
    const contractID = await this.contractService.createContract({ ...req.body });
    return CustomResponse.send(res, { contractID }, 'Done', 201);
  }

  @boundMethod
  public async getContracts(req: any, res: any){
    const contracts = await this.contractService.getContracts();
    return CustomResponse.send(res, contracts);
  }

  @boundMethod
  public async getContract(req: any, res: any){
    const contract = await this.contractService.getContract(req.query.id);
    return CustomResponse.send(res, contract);
  }
}

export default new ContractController();