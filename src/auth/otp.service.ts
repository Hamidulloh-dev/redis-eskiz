import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/core/database/redis.service';
import { generate } from 'otp-generator';
import { SmsService } from './sms.service';

@Injectable()
export class OtpService {
  constructor(
    private redisService: RedisService,
    private smsService: SmsService
  ) { }
  private generateOtp() {
    const otp = generate(6, {
      digits: true,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });
    return otp;
  }

  private getSessionOtp() {
    const token = crypto.randomUUID()
    return token
  }

  async sendOtp(phone_number: string) {
    const key = `user:${phone_number}`;
    await this.chekOtpExisted(key);
    const tempOtp = this.generateOtp();
    const responseRedis = await this.redisService.setOtp(phone_number, tempOtp);
    if (responseRedis === 'OK') {
      await this.smsService.sendSms(phone_number, tempOtp)
      return true;
    }
  }

  async chekOtpExisted(key: string) {
    const checkOtp = await this.redisService.getOtp(key);
    if (checkOtp) {
      const ttl = await this.redisService.getTTL(key);
      throw new BadRequestException(
        `iltimos ${ttl} secundan keyin urinib noring`,
      );
    }
  }

  async verifyOtpSendedUser(key: string, code: string, phone_number: string) {
    const otp = await this.redisService.getOtp(key);
    if (!otp || otp !== code) throw new BadRequestException('cod yaroqsiz');
    await this.redisService.delKey(key);
    const sessionToken = this.getSessionOtp()
    await this.redisService.setSessionTokenUser(phone_number, sessionToken)
    return sessionToken
  }

  async checkSessionTokenUser(key: string, token: string) {
    const sessionToken: string = await this.redisService.getKey(key) as string
    if (!sessionToken || sessionToken !== token) throw new BadRequestException('session token muddati tugagan')
  }
  
  async delSessionTokenUser(key: string) {
    await this.redisService.delKey(key)
  }
}
