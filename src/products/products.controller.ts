import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../users/roles/roles.decorator';
import { Role } from '../users/roles/role.enum';
import { RolesGuard } from '../users/roles/roles.guard';
import { Product } from './interfaces/product.interface';
import { Auth } from '../auth/auth.decorator';
import { UserDto } from '../users/dto/user.dto';

@Controller('product')
@ApiTags('Product')
export class ProductsController {
  constructor( private readonly productsService: ProductsService) { }

  @ApiOperation({ summary: 'addProduct' })
  @Post()
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async addProduct(@Res() res: Response , @Body() productDto: ProductDto ): Promise<Response<Product>> {
    const result = await this.productsService.addProduct(productDto).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when add products' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.CREATED).json(result);
  }

  @ApiOperation({ summary: 'getProducts' })
  @Get()
  @ApiResponse({ status: 200, description: 'Product retrieves ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProducts(@Res() res: Response): Promise<Response<Product[]>> {
    const result = await this.productsService.getProducts().catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get products' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({ summary: 'getProductById' })
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Product retrieve ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProduct(@Res() res: Response , @Param('id') productId: string ): Promise<Response<Product>>  {
    const result = await this.productsService.getProductById(productId).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get product' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({ summary: 'updateProduct' })
  @Put(':id')
  @ApiResponse({ status: 201, description: 'Product update ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateProduct(
    @Res() res: Response,
    @Param('id') productId: string,
    @Body() productDto: ProductDto,
    @Auth() userDto: UserDto,
  ): Promise<Response<Product>> {
    // @ts-ignore
    const result = await this.productsService.updateProduct(productId, productDto, userDto).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get product' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({ summary: 'removeProduct' })
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product delete ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async removeProduct(@Res() res: Response, @Param('id') productId: string): Promise<Response> {
    const result = await this.productsService.deleteProduct(productId).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when remove product' + err,
        data: {productId: this.productsService},
      });
    });
    return res.status(HttpStatus.OK).send({ status: 200, message: 'remove product ok'});
  }
}
