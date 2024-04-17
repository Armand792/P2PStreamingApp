import { JSONSchemaType } from 'ajv';
import {
  ILoginRequest,
  IRegistrationRequest,
} from '../interfaces/user.interface';

export const RegistrationSchema: JSONSchemaType<IRegistrationRequest> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

export const LoginSchema: JSONSchemaType<ILoginRequest> = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },

    password: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};



