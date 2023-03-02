import { Injectable } from '@nestjs/common';
import {HttpClient} from "../../common/http-client/http-client";
import * as cheerio from "cheerio";
import {Website} from "../model/Website";
import {WebsiteService} from "../../website/service/website.service";

@Injectable()
export class MinerService {
    private httpClient: HttpClient;

    constructor(
        private readonly websiteService: WebsiteService
    ) {
        this.httpClient = new HttpClient();
    }


    async getAndSaveData(url: string) {
        const httpResponse = await this.httpClient.get(url);
        const website = new Website(httpResponse);

        website
            .setUrl(url)
            .setTitle()
            .setFavIconUrl()
            .setImageUrls()
            .setStylesheetUrls()
            .setMetadataDescription()

        await this.websiteService.create(website);
    }

}
