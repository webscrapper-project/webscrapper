import { Injectable } from '@nestjs/common';
import {CrawlRequestDto} from "../dto/crawl-request.dto";
import {HttpClient} from "../../common/http-client/http-client";
import {UrlNotCorrectException} from "../../common/exception/scrapper-exception";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {WebsiteDocument} from "../model/website.schema";
import {CrawlResponseDto} from "../dto/crawl-response.dto";

@Injectable()
export class WebsiteService {
  private readonly httpClient;

  constructor(
      @InjectModel('Customer')
      private readonly websiteModel: Model<WebsiteDocument>,
  ) {
    this.httpClient = new HttpClient()
  }

  async crawl(crawlRequestBody: CrawlRequestDto): Promise<CrawlResponseDto> {
    const httpResponse = await this.httpClient.get(crawlRequestBody.url);

    if (!httpResponse){
      throw new UrlNotCorrectException();
    }

    await this.websiteModel.create({
      url: crawlRequestBody.url,
      status: true
    })

    const response = new CrawlResponseDto();

    response.url = crawlRequestBody.url;
    response.status = true;

    return response;
  }

  getActiveCrawlJobs() {

  }

  getCrawlJobStatus(id) {

  }

  cancelCrawlJob(id) {

  }
}
