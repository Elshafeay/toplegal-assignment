import { BadRequestError } from '../../errors/bad-request-error';
import { ICreateUser, IUserSerialized } from './user.interfaces';
import { Password } from '../../utils/password';
import { JWT } from '../../utils/jwt';
import userRepositoryInstance, { UserRepository } from './user.repository';
import { boundMethod } from 'autobind-decorator';

export class UserService {
  private userRepository: UserRepository;

  constructor(
  ) {
    this.userRepository = userRepositoryInstance;
  }

  @boundMethod
  public async getUser(id: string){
    const user = await this.userRepository.findOneById(id);
    return user || null;
  }

  @boundMethod
  public async getUsers(){
    return await this.userRepository.findAll();
  }

  @boundMethod
  public async login(email: string, password: string){
    const user = await this.userRepository.findOneByEmail(email);
    if(!user){
      return null;
    }

    const isMatch = await Password.compare(user.password, password);
    if(isMatch){
      const token = JWT.sign(user as IUserSerialized);

      const { password, ...userSerialization } = user;

      const result = { user: userSerialization, token };
      return result;
    }else{
      return null;
    }
  }

  @boundMethod
  public async signUp(dataObject: ICreateUser){
    const existingUser = await this.userRepository.findOneByEmail(dataObject.email);
    if(existingUser){
      throw new BadRequestError('There\'s a user with this email already!');
    }
    const hashedPassword = await Password.toHash(dataObject.password);

    dataObject.password = hashedPassword ;
    const userID = await this.userRepository.create(dataObject);
    const user = await this.userRepository.findOneById(userID);
    // Creating a JWT token for this user, and returning it back in the response
    // so that it can be used in the Authentication process
    const token = JWT.sign(user as IUserSerialized);
    const result = { user, token };

    return result;
  }
}

export default new UserService();