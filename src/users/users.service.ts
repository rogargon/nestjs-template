import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from "./user";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { DuplicateIdentifierException } from '../utils/duplicate-identifier.exception';
import bcrypt = require("bcrypt");

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<User> | any) {}

    async create(user: User): Promise<User> {
        if (await this.exists(user.username))
            throw new DuplicateIdentifierException(`${user.username}`);
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

    findOne(id: string): Promise<User> {
        return this.userModel.findOne({username: id});
    }

    updateOne(auth: User, id: string, newUser: User): Promise<User> {
        delete newUser.username;
        if (!auth.roles.includes('admin')) {
            if (id !== auth.username)
                throw new ForbiddenException(`Unauthorized to update username ${id}`);
            delete newUser.roles;
        }
        return this.userModel.findOneAndUpdate({ username: id }, newUser, { new: true });
    }

    deleteOne(auth: User, id: string): Promise<User> {
        if (!auth.roles.includes('admin')) {
            if (id !== auth.username)
                throw new ForbiddenException(`Unauthorized to delete username ${id}`);
        }
        return this.userModel.findOneAndDelete({ username: id });
    }

    deleteAll() {
        return this.userModel.deleteMany();
    }
}
