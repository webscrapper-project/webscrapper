import {InjectQueue, Process, Processor} from "@nestjs/bull";
import {QueueName} from "../../common/enums/queueName";
import { Job, Queue } from "bull";
import {WebsiteCrawlerJobPayloadDto} from "../dto/website-crawler-job-payload.dto";
import {Cron, CronExpression} from "@nestjs/schedule";
import {JobService} from "../service/job.service";

@Processor(QueueName.WEBSITE)
export class WebsiteCrawlerProcessor {
    constructor(
        private readonly jobService: JobService
    ) {}

    @Process({concurrency: 1})
    protected async handleWebsiteCrawlerJob(
        job: Job<WebsiteCrawlerJobPayloadDto>
    ){
        const { data } = job;

        console.log(data);
    }

    @Cron(CronExpression.EVERY_10_MINUTES, {
        name: "validation",
        timeZone: "UTC",
    })
    async validateSchedule(){
        const jobs = await this.jobService.getActiveJobs()

        for (const job of jobs) {

        }
    }
}
