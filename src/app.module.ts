import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {WebsiteModule} from "./website/website.module";
import {MongooseModule} from "@nestjs/mongoose";
import {BullModule} from "@nestjs/bull";
import { JobModule } from './job/job.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (cfg: ConfigService) => ({
              uri: `mongodb://${cfg.get('DB_M_USERNAME')}:${cfg.get(
                  'DB_M_PASSWORD',
              )}@${cfg.get('DB_M_HOST')}:${cfg.get('DB_M_PORT')}/${cfg.get(
                  'DB_M_NAME',
              )}`,
          }),
      }),
      BullModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              redis: {
                  host: configService.get('QUEUE_HOST'),
                  port: +configService.get('QUEUE_PORT'),
              },
          }),
          inject: [ConfigService],
      }),
      WebsiteModule,
      JobModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
