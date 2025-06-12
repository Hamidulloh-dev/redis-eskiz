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
  async register(@Body() dto: CreateAuthDto) {
    const respons = this.authService.register()
    return respons
  }
}