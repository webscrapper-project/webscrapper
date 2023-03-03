import { Module } from '@nestjs/common';
import {WebsiteService} from "./service/website.service";
import {MongooseModule} from "@nestjs/mongoose";
import {JobSchema} from "../job/model/job.schema";
import {WebsiteDetailSchema} from "./model/website-detail.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'WebsiteDetail',
        schema: WebsiteDetailSchema,
      },
    ]),
  ],
  providers: [WebsiteService],
  exports: [WebsiteService]
})
export class WebsiteModule {}
