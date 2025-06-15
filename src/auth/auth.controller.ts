import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('send-otp')
  async sendOtpUser(@Body() dto: CreateAuthDto) {
    const respons = await this.authService.sendOtpUser(dto)
    return respons
  }

  @Post('verify-otp')
  async verfyOtp(@Body() dto: VerifyOtpDto) {
    return await this.authService.verifyOtp(dto)
  }

  @Post('register')
  async register(@Body() dto: CreateAuthDto, @Res({passthrough: true}) res: Response) {
    const token = this.authService.register(dto)
    res.cookie('token', token, {
      maxAge: 1.1 * 60 * 60 * 1000,
      httpOnly: true
    })
    return token
  }
}