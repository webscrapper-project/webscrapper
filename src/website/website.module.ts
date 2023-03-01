import { Module } from '@nestjs/common';
import {WebsiteController} from "./controller/website.controller";
import {WebsiteService} from "./service/website.service";

@Module({
  imports: [],
  controllers: [WebsiteController],
  providers: [WebsiteService],
})
export class WebsiteModule {}
