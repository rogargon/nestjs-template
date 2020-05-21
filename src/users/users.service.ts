import { Injectable } from '@nestjs/common';
import { User } from "./user";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import bcrypt = require("bcrypt");

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async create(user: User): Promise<User> {
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    exists(id: string): Promise<boolean> {
        return this.userModel.exists({ username: id });
    }

    findAll(): Promise<User[]> {
        return this.userModel.find();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findOne({username: id});
    }

    deleteAll() {
        return this.userModel.deleteMany();
    }
}
