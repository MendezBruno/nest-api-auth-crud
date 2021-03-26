import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { WinstonModule,  } from 'nest-winston';
import { AppLogger } from '../core/services/logger.service';
import { UsersModule } from '../users/users.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { UsersService } from '../users/users.service';
import { ConfigModule } from '../core/config/config.module';
import { ConfigService } from '../core/config/config.service'
import { MailerModule } from '@nest-modules/mailer';
import { UserSchema } from '../users/schema/user.schema';
import { ProductSchema } from './schema/product.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }, { name: 'user', schema: UserSchema }]),
    WinstonModule,
    UsersModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('MAILER_EMAIL'),
            pass: configService.get('MAILER_PASS')},
        },
        defaults: {
          from: '"Api" <mendezbruno.sist.info@gmail.com>',
        },
      }),
      inject: [ConfigService],

    }),
    ConfigModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, AppLogger , SendEmailMiddleware, UsersService],
})
export class ProductsModule { }
