import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';

export const createContractValidation: IValidationSchema = {
  body: Joi.object({
    userID: Joi
      .string()
      .uuid({ version: 'uuidv4' })
      .required(),

    contractName: Joi
      .string()
      .min(3)
      .required(),

    templateID: Joi
      .string()
      .uuid({ version: 'uuidv4' })
      .required(),
  }).required(),
};

export const getContractValidation: IValidationSchema = {
  query: Joi.object({
    id: Joi
      .string()
      .uuid({ version: 'uuidv4' })
      .required(),
  }).required(),
};
