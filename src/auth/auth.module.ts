import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpService } from './otp.service';
import { DatabaseModule } from 'src/core/database/database.module';
import { SmsService } from './sms.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, OtpService, SmsService],
})
export class AuthModule {}
