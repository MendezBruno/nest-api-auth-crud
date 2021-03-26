import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../core/config/config.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MailerModule } from '@nest-modules/mailer';
import { ConfigService } from '../core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { TokenVerifyEmailSchema, UserSchema } from '../users/schema/user.schema';
import { UsersModule } from 'src/users/users.module';
import { AppLogger } from '../core/services/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
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
  providers: [AuthService, JwtStrategy, SendEmailMiddleware, AppLogger],
  controllers: [AuthController],
})
export class AuthModule { }
