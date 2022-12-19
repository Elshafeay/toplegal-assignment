import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';

export const getUserValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi
      .string()
      .uuid({ version: 'uuidv4' })
      .required(),
  }).required(),
};

export const createUserValidation: IValidationSchema = {
  body: Joi.object({
    firstname: Joi
      .string()
      .min(3)
      .max(100)
      .required(),

    lastname: Joi
      .string()
      .min(3)
      .max(100)
      .required(),

    email: Joi
      .string()
      .email()
      .max(255)
      .required(),

    password: Joi
      .string()
      .min(8)
      .max(100)
      .required(),
  }).required(),
};

export const loginValidation: IValidationSchema = {
  body: Joi.object({
    email: Joi
      .string()
      .email()
      .max(255)
      .required(),

    password: Joi
      .string()
      .min(8)
      .max(100)
      .required(),
  }).required(),
};