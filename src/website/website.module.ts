import { Module } from '@nestjs/common';
import {WebsiteController} from "./controller/website.controller";
import {WebsiteService} from "./service/website.service";
import {MongooseModule} from "@nestjs/mongoose";
import {WebsiteSchema} from "./model/website.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Website',
        schema: WebsiteSchema,
      },
    ]),
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
})
export class WebsiteModule {}
