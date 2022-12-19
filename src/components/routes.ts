import { Express } from 'express';
import contract from './contract/contract.routes';

class routing {

  api(app: Express) {
    contract(app);
  }
}
export default new routing();