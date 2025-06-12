import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { OtpService } from './otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private otpService: OtpService,
  ) {}
  async sendOtpUser(dto: CreateAuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { phone_number: dto.phone_number },
    });
    if (user) throw new ConflictException('phone_number allaqachaon mavjud');
    const res = await this.otpService.sendOtp(dto.phone_number);
    if (!res) throw new InternalServerErrorException('serverda xatolik');
    return { message: 'code yuborildi' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const key = `user:${dto.phone_number}`;
    await this.otpService.verifyOtpSendedUser(key, dto.code);
    return {
      message: 'succes',
      statusCode: 200,
    };
  }

  async register() {}

  async login() {}
}
