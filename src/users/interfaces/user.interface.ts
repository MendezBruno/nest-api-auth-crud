import { Document } from 'mongoose';
import { Role } from '../roles/role.enum';

export interface User extends Document {
  _id: string;
  email: string;
  password: string;
  emailVerified: boolean;
  roles: Role[];
}

export interface TokenVerifyEmail extends Document {
  userId: string;
  tokenVerifyEmail: string;
}
