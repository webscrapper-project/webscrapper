import {Injectable} from '@nestjs/common';
import {CrawlRequestDto} from "../dto/crawl-request.dto";
import {HttpClient} from "../../common/http-client/http-client";
import {UrlNotCorrectException, WebsiteAlreadyExist} from "../../common/exception/scrapper-exception";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Job, JobDocument} from "../model/job.schema";
import {CrawlResponseDto} from "../dto/crawl-response.dto";
import {InjectQueue} from "@nestjs/bull";
import {QueueName} from "../../common/enums/queueName";
import {Queue} from "bull";
import {WebsiteCrawlerJobPayloadDto} from "../dto/website-crawler-job-payload.dto";
import {JobResponseDto} from "../dto/job-response.dto";
import {jobSchemaToJobDtoMapper} from "../mapper/job-schema-to-job-dto.mapper";

@Injectable()
export class JobService {
  private readonly httpClient;

  constructor(
      @InjectModel('Job')
      private readonly jobModel: Model<JobDocument>,
      @InjectQueue(QueueName.WEBSITE)
      private readonly websiteCrawlerQueue: Queue<WebsiteCrawlerJobPayloadDto>,
  ) {
    this.httpClient = new HttpClient()
  }

  async crawl(crawlRequestBody: CrawlRequestDto): Promise<CrawlResponseDto> {
    const httpResponse = await this.httpClient.get(crawlRequestBody.url);

    if (!httpResponse){
      throw new UrlNotCorrectException();
    }

    const job = await this.jobModel.findOne({url: crawlRequestBody.url}).exec();

    if (job && job.status){
      throw new WebsiteAlreadyExist();
    }

    await this.createJob(crawlRequestBody);

    const response = new CrawlResponseDto();

    response.url = crawlRequestBody.url;
    response.status = true;

    return response;
  }

  async getActiveJobs(): Promise<JobResponseDto[]> {
    const jobs = await this.jobModel.find({ status: true }).exec();

    return jobs.map(job => jobSchemaToJobDtoMapper(job));
  }

  async getWebsiteStatus(id): Promise<JobResponseDto> {
    const job = await this.jobModel.findOne({id}).exec();
    return jobSchemaToJobDtoMapper(job);
  }

  async cancelWebsiteCrawlJob(id) {
    await this.jobModel.updateOne({id},{$set: {status: false}});
    const job = await this.websiteCrawlerQueue.getJob(id);
    await job.remove();
  }

  async createJob({ url }:CrawlRequestDto){
    const job = await this.jobModel.create({
      url,
      status: true
    })

    await this.websiteCrawlerQueue.add({
      url,
      jobId: job._id
    });
  }
}
