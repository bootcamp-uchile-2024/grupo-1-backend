import { IsEmail, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredencialesDto {
  @ApiProperty({
    description: 'Ingrese mail de usuario',
    example: 'juanito123@mail.com',
    type: String,
    minLength: 3,
    maxLength: 50,
  })
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  email: string;



  @ApiProperty({
    description: 'ingrese su contraseña',
    example: 'mypassword123',
    type: String,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;


}
