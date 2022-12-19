export interface ITimestamps {
}

export interface IContract extends ICreateContract {
  contractID: string,
  signedAt: Date | null,
  createdAt: Date
}

export interface ICreateContract{
  userID: string,
  contractName: string,
  templateID: string,
}

export interface IGetContractsResult {
  contractID: string,
}
