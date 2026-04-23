import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  async createAdminIfNotExists() {
    const existing = await this.userModel.findOne({ username: 'admin' });

    if (!existing) {
      const hash = await bcrypt.hash('admin', 10);

      await this.userModel.create({
        username: 'admin',
        password: hash,
        role: UserRole.ADMIN,
      });
    }
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}