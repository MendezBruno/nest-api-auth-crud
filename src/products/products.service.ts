import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { AppLogger } from '../core/services/logger.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { UsersService } from '../users/users.service';
import { Product } from './interfaces/product.interface';
import { UserDto } from '../users/dto/user.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private appLogger: AppLogger,
    private sendEmailMiddleware: SendEmailMiddleware,
    private userService: UsersService,
  ) { }

  async addProduct(productDto: ProductDto): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    return  await newProduct.save();
  }

  async getProducts(): Promise<Product[]> {
    this.appLogger.warn(' getProducts ');
    this.appLogger.error(' getProducts ', 'test');
    this.appLogger.log(' getProducts ');
    return await this.productModel.find();
  }

  async getProductById(productId: string): Promise<Product> {
    const prod = await this.productModel.findById({ _id: productId });
    this.incrementHits(productId);
    return Promise.resolve(prod);
  }

  async updateProduct(productId: string, product: ProductModel, userDto: Partial<UserDto>): Promise<Product> {
    const oldProd = await this.productModel.findByIdAndUpdate({ _id: productId }, product, { new: false });
    if ( oldProd.price !== product.price ) {
      let users = await this.userService.findByRoleAdmin();
      users = users.filter( ( e ) =>  e._id === userDto.id );
      users.forEach(aUser => this.sendEmailMiddleware.changePriceSendEmail(aUser, oldProd, product, userDto));
    }
    return oldProd;
  }

  async deleteProduct(prodId: string): Promise<any> {
    return await this.productModel.deleteOne({ _id: prodId });
  }

  private incrementHits(id: string) {
    const query = { _id: id };
    // prod.hits = prod.hits + 1;
    // @ts-ignore
    this.productModel.findOneAndUpdate( query, {$inc: { hits: 1} }, {new: true }, (err) => {
      if (err) {
        this.appLogger.error(' incrementHits ', err );
      }
    });
  }
}
