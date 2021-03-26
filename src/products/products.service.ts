import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { AppLogger } from '../core/services/logger.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { UsersService } from '../users/users.service';
import { Product } from './interfaces/product.interface';
import { UserDto } from '../users/dto/user.dto';

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
    this.incrementHits(productId);
    return await this.productModel.findById({ _id: productId });
  }

  async updateProduct(productId: string, product: Partial<ProductDto>, userDto: Partial<UserDto>): Promise<Product> {
    const oldProd = await this.productModel.findByIdAndUpdate({ _id: productId }, product, { new: false });
    if ( oldProd.price !== product.price ) {
      let users = await this.userService.findByRole('admin');
      users = users.filter( ( e ) =>  e._id.toString() === userDto.id );
      users.forEach(aUser => this.sendEmailMiddleware.changePriceSendEmail(aUser, oldProd, product, userDto));
    }
    return oldProd;
  }

  async deleteProduct(prodId: string): Promise<void> {
    return await this.productModel.deleteOne({ _id: prodId });
  }

  private incrementHits(id) {
    const query = { _id: id };
    const update = { $inc: { hits: 1 } };
    this.productModel.findOneAndUpdate( query, update, {new: true }, (err) => {
      if (err) {
        this.appLogger.error(' incrementHits ', err );
      }
    });
  }
}
