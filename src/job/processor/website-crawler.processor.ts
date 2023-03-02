import {InjectQueue, Process, Processor} from "@nestjs/bull";
import {QueueName} from "../../common/enums/queueName";
import { Job, Queue } from "bull";
import {WebsiteCrawlerJobPayloadDto} from "../dto/website-crawler-job-payload.dto";
import {Cron, CronExpression} from "@nestjs/schedule";
import {JobService} from "../service/job.service";
import {MinerService} from "../../miner/service/miner.service";

@Processor(QueueName.WEBSITE)
export class WebsiteCrawlerProcessor {
    constructor(
        private readonly jobService: JobService,
        private readonly minerService: MinerService,
    ) {}

    @Process({concurrency: 1})
    protected async handleWebsiteCrawlerJob(
        job: Job<WebsiteCrawlerJobPayloadDto>
    ){
        await this.minerService.getAndSaveData(job.data.url);
    }

    // @Cron(CronExpression.EVERY_5_SECONDS, {
    //     name: "validation",
    //     timeZone: "UTC",
    // })
    async validateSchedule(){
        const jobs = await this.jobService.getActiveJobs()
        for (const job of jobs) {
            await this.minerService.getAndSaveData(job.url);
        }
    }
}
