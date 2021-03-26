import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { WinstonModule } from 'nest-winston';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${process.env.DB_URI_P  || configService.get('DB_URI')}/${configService.get('DB_NAME')}`,
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule, ProductsModule,
    WinstonModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  static port: number | string;
  // tslint:disable-next-line:variable-name
  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
    console.log('AppModule.port', AppModule.port);
  }
}
