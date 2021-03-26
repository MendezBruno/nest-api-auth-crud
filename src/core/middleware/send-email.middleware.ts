import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '../config/config.service';
import { Product } from '../../products/interfaces/product.interface';
import { ProductDto } from '../../products/dto/product.dto';
import { UserDto } from '../../users/dto/user.dto';
import { AppLogger } from '../services/logger.service';

@Injectable()
export class SendEmailMiddleware {
    constructor(
      private mailerService: MailerService,
      private configService: ConfigService,
      private appLogger: AppLogger,
    ) { }

    sendEmail(email: string, token: string, attachmentsArray) {

        // in the case that we will communicate with front-end app
        // let link = `http://${this.configService.get('WEB_APP_URI')}/#/account?tokenVerifyEmail=${token}`;

        // in this case that will return verifyEmail to true
        const link = `http://${this.configService.get('WEB_APP_URI')}/auth/verify/${token}`;
        const subjectObject = {
            subjectTitle: 'E-mail de confirmation complete "API"',
            subjectBody: `Hello ,
            Your account associated with the email address ${email} requires verification.
            To complete the verification process for your account, please click on this link:  ${link} <br>`,
        };
        try {
            const mailOptions = {
                to: email,
                subject: subjectObject.subjectTitle,
                html: subjectObject.subjectBody,
                attachments: attachmentsArray,
            };
            this.mailerService.sendMail(mailOptions)
                .then((info) => {
                    this.appLogger.log('email sent ' + info);
                });
        } catch (error) {
            this.appLogger.error('error', error);
        }
    }

    changePriceSendEmail(userReceive: Partial<UserDto>, oldProduct: Product, newProduct: Partial<ProductDto>, userSend: Partial<UserDto>) {

        const subjectObject = {
            subjectTitle: `${oldProduct.name} change price "API" `,
            subjectBody: `Hello,
            the product ${oldProduct.name} change the price from ${oldProduct.price}
            to ${newProduct.price} by ${userSend.email} <br>`,
        };
        try {
            const mailOptions = {
                to: userReceive.email,
                subject: subjectObject.subjectTitle,
                html: subjectObject.subjectBody,
            };
            this.mailerService.sendMail(mailOptions)
              .then((info) => {
                  this.appLogger.log('email sent ' + info);
              });
        } catch (error) {
            this.appLogger.error('error', error);
        }
    }
}
