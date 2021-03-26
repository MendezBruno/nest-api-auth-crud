import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    brand: string;

    @IsNumber()
    @ApiProperty()
    price: number;

    @IsNumber()
    @ApiProperty()
    hits: number;
}
