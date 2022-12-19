import { validateRequest } from '../../middlewares/validate-request';

import contractController from './contract.controller';
import { createContractValidation, getContractValidation } from './contract.schemas';

const contractRouter = (app: any) => {
  app.post(
    '/createContract',
    validateRequest(createContractValidation),
    contractController.createContract,
  );

  app.get(
    '/getContractIDs',
    contractController.getContracts,
  );

  app.get(
    '/getContract',
    validateRequest(getContractValidation),
    contractController.getContract,
  );
};

export default contractRouter;