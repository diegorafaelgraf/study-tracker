import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument, UserRole } from './schemas/user.schema';
import { Year, YearDocument } from '../year/schemas/year.schema';

import { Model, Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Year.name)
    private yearModel: Model<YearDocument>,
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
      throw new ConflictException(`El usuario ${dto.username} ya existe`);
    }

    const hash = await bcrypt.hash(dto.password, 10);

    let user: any = null;

    try {
      user = await this.userModel.create({
        username: dto.username,
        password: hash,
        role: dto.role || 'USER',
      });

      const currentYear = new Date().getFullYear();

      const totalDays =
        new Date(currentYear, 1, 29).getMonth() === 1
          ? 366
          : 365;

      await this.yearModel.create({
        userId: user._id,
        year: currentYear,
        totalDays,
        closed: false,
      });

      return user;
    } catch (error) {
      // manual rollback in case of error creating the year after creating the user
      if (user?._id) {
        await this.userModel.deleteOne({ _id: user._id });
      }

      throw error;
    }
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