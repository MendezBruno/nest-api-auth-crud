import { Role } from '../roles/role.enum';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  id: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsBoolean()
  @ApiProperty()
  emailVerified: boolean;

  @IsEnum(Role)
  @ApiProperty()
  roles: Role[];
}
