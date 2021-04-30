import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
        } } })
export class User {
    @Prop() username: string;
    @Prop() fullname: string;
    @Prop() organization: string;
    @Prop() email: string;
    @Prop() password: string;
    @Prop([String]) roles: string[];
    @Prop({ default: Date.now }) created: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
