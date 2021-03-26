import {
  Body,
  Controller,
  Delete,
  Get, HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { UsersService } from './users.service';
import { RolesGuard } from './roles/roles.guard';
import { Response } from 'express';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get users ok ' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllUsers(@Res() res: Response): Promise<Response<User[]>> {
    const result = await this.usersService.getAllUsers().catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get users' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('/me')
  @ApiResponse({ status: 200, description: 'Me retrieve ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Res() res: Response, @Auth() { id }: UserDto): Promise<Response<User>> {
    const result = await this.usersService.getUserById(id).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get me' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'User created ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createUser(@Res() res: Response, @Body() user: UserDto): Promise<Response<User>> {
    const result = await this.usersService.createUser(user).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get me' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'User updated ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUser(@Res() res: Response, @Param('id') id: string, @Body() user: UserDto): Promise<Response<User>> {
    const result = await this.usersService.updateUser(id, user).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get me' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'User created ok' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async deleteUser(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    const result = await this.usersService.deleteUser(id).catch((err) => {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: 403,
        message: 'Error when get me' + err,
        data: result,
      });
    });
    return res.status(HttpStatus.OK).send({status: 200, message: 'User delete ok'});
  }
}
