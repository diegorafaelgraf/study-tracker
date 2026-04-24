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

  async createUser(dto: {
    username: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    const existing = await this.userModel.findOne({
      username: dto.username,
    });

    if (existing) {
      throw new Error('Usuario ya existe');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.userModel.create({
      username: dto.username,
      password: hash,
      role: dto.role || 'USER',
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    return user.save();
  }
}