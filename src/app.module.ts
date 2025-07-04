import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule],
})
export class AppModule {}
