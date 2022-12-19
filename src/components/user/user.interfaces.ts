export interface ITimestamps {
  createdAt: Date,
  updatedAt: Date
}

export interface IUserModel extends ITimestamps {
  userID: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
}

export interface ICreateUser{
  firstname: string,
  lastname: string,
  email: string,
  password: string
}

export type IUserSerialized = Omit<IUserModel, 'password'>
