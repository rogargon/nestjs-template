import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { Seeder } from './seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI', 'mongodb://localhost/db'),
        useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
      }),
    }),
    AuthModule, UtilsModule, UsersModule,
  ],
  providers: [Seeder],
  controllers: [AppController],
})
export class AppModule {}
