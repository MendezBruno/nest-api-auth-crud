import { Document } from 'mongoose';

export class ProductModel extends Document {
  id?: string;
  name: string;
  brand: string;
  price: number;
  hits: string;
}
