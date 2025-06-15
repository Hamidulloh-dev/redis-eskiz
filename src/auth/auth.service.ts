import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { OtpService } from './otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
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
    const sessionToken = await this.otpService.verifyOtpSendedUser(key, dto.code, dto.phone_number);
    return {
      message: 'succes',
      statusCode: 200,
      session_token: sessionToken
    };
  }

  async register(dto: CreateAuthDto) {
    const key = `session_token:${dto.phone_number}`
    await this.otpService.checkSessionTokenUser(key, dto.session_token)
    const hashPass = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create(
      {
        data: { phone_number: dto.phone_number, password: hashPass }
      }
    )
    const token = this.jwtService.sign(
      { user_id: user.id })
    await this.otpService.delSessionTokenUser(key)
    return {token}
  }

  async login() {}
}
