import { Injectable } from '@nestjs/common';
import {CrawlRequestDto} from "../dto/crawl-request.dto";
import {HttpClient} from "../../common/http-client/http-client";
import {UrlNotCorrectException} from "../../common/exception/scrapper-exception";

@Injectable()
export class WebsiteService {

  private readonly httpClient;
  constructor() {
    this.httpClient = new HttpClient()
  }

  async crawl(crawlRequestBody: CrawlRequestDto) {
    const response = await this.httpClient.get(crawlRequestBody.url);
    if (!response){
      throw new UrlNotCorrectException();
    }
  }

  getActiveCrawlJobs() {

  }

  getCrawlJobStatus(id) {

  }

  cancelCrawlJob(id) {

  }
}
