import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../roles/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  fullname: string;
  @Prop({
    required: true,
    unique: true,
  })
  email: string;
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    unique: true,
  })
  publicAddress: string;

  @Prop({
    required: true,
  })
  nonce: number;

  @Prop({
    required: true,
    unique: true,
  })
  nin: number;

  @Prop({
    type: Array,
    enum: Array<Role>,
    default: ['USER'],
  })
  role: Array<Role>;
}

export const UserSchema = SchemaFactory.createForClass(User);
