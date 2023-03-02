import { Module } from '@nestjs/common';
import {WebsiteController} from "./controller/website.controller";
import {WebsiteService} from "./service/website.service";
import {MongooseModule} from "@nestjs/mongoose";
import {JobSchema} from "../job/model/job.schema";

@Module({
  imports: [

  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService]
})
export class WebsiteModule {}
