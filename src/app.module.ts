import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {WebsiteModule} from "./website/website.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      WebsiteModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
