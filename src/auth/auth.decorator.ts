import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';

export const Auth = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Partial<UserDto> => {
        try {
          const request = ctx.switchToHttp().getRequest();
          return request.user;
        } catch (error) {
          throw new ForbiddenException();
        }
    },
  );
