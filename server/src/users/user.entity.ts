import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/validator/match.decorator';

export class User {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  fullname: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @IsNotEmpty()
  publicAddress: string;

  @IsNumber()
  @IsNotEmpty()
  nonce: number = Math.floor(Math.random() * 1000000);

  @Match(User, (s) => s.password, { message: "Password doesn't match" })
  passwordConfirm: string;
}
function Column(arg0: { unique: boolean }) {
  throw new Error('Function not implemented.');
}
