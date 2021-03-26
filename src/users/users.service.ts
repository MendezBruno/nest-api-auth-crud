import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('user')
        private readonly userModels: Model<User>,
      ) {}

    onModuleInit() {
        console.log(`The module has been initialized.`);
      }

    async deleteUser(id: string): Promise<void> {
        return await this.userModels.deleteOne({ _id: id });
    }
    updateUser(id: string, user: UserDto): Promise<User> {
        return this.userModels.findByIdAndUpdate({ _id: id }, user, { new: true });
    }

    async createUser(userDto: UserDto): Promise<User> {
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

    async findByRole(admin: string): Promise<User[]> {
        return await this.userModels.find({roles: admin});
    }
}
