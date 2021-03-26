import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
import { Role } from './roles/role.enum';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('user')
        private readonly userModels: Model<User>,
      ) {}

    async deleteUser(id: string): Promise<any> {
        return await this.userModels.deleteOne({ _id: id });
    }
    updateUser(id: string, user: UserDto): Promise<User> {
        const result = this.userModels.findByIdAndUpdate({ _id: id }, user, { new: true });
        return Promise.resolve(result);
    }

    async createUser(userDto: UserDto): Promise<any> {
        const newUser = new this.userModels(userDto);
        await newUser.save();
        return newUser.toObject({ versionKey: false });
    }

    async getUserById(id: string): Promise<User> {
        return await this.userModels.findById({ _id: id });
    }
    async getAllUsers(): Promise<User[]> {
        return await this.userModels.find();
    }

    async findByRoleAdmin(): Promise<any[]> {
        return await this.userModels.find({roles: Role.Admin});
    }
}
