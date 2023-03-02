import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import {QueueName} from "../common/enums/queueName";
import {ScheduleModule} from "@nestjs/schedule";
import {WebsiteModule} from "../website/website.module";
import {JobService} from "./service/job.service";
import {JobController} from "./controller/job.controller";
import {WebsiteCrawlerProcessor} from "./processor/website-crawler.processor";
import {MongooseModule} from "@nestjs/mongoose";
import {JobSchema} from "./model/job.schema";
import {MinerModule} from "../miner/miner.module";

@Module({
    imports: [
        BullModule.registerQueue({
            name: QueueName.WEBSITE,
        }),
        MongooseModule.forFeature([
            {
                name: 'Job',
                schema: JobSchema,
            },
        ]),
        ScheduleModule.forRoot(),
        WebsiteModule,
        MinerModule
    ],
    controllers: [JobController],
    providers: [JobService,WebsiteCrawlerProcessor],
})
export class JobModule {}
