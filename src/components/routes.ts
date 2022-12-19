import { Express } from 'express';
import contract from './contract/contract.routes';
import user from './user/user.routes';

class routing {

  api(app: Express) {
    contract(app);
    user(app);
  }
}
export default new routing();