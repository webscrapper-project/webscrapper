import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {WebsiteModule} from "./website/website.module";
import {MongooseModule} from "@nestjs/mongoose";

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
      WebsiteModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
