import { Injectable } from '@nestjs/common';
import {Website} from "../../miner/model/Website";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {WebsiteDetailDocument} from "../model/website-detail.schema";

@Injectable()
export class WebsiteService {
  private readonly httpClient;

  constructor(
      @InjectModel('WebsiteDetail')
      private readonly websiteDetailModel: Model<WebsiteDetailDocument>,
  ) {

  }

    async create(website: Website) {
      await this.websiteDetailModel.create({
        url: website.websiteUrl,
        title: website.title,
        favicon: website.favicon,
        imageUrls: website.imageUrls,
        stylesheetUrls: website.stylesheetUrls,
        metadataDescriptions: website.metaDataDescriptions
      })
    }
}
