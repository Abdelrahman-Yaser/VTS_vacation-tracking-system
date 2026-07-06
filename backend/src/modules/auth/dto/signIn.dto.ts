import { IsEmail, IsString } from 'class-validator';

export class CreateSignInDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
