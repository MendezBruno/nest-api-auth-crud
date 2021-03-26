import {Schema} from 'mongoose';

export const ProductSchema = new Schema({
  name: { type: String},
  brand: { type: String },
  price: { type: Number },
  hits: { type: Number },
}, { timestamps: true});
