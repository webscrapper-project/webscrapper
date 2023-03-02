import {BaseSchema} from "../../common/schema/base.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema({
    collection: 'websiteDetail',
})
export class WebsiteDetail extends BaseSchema {
    @Prop()
    url: string;

    @Prop()
    title: string;

    @Prop()
    favicon: string;

    @Prop()
    imageUrls: string[];

    @Prop()
    stylesheetUrls: string[];

    @Prop()
    metadataDescriptions: string[];
}

export const WebsiteDetailSchema = SchemaFactory.createForClass(WebsiteDetail);

export type WebsiteDetailDocument = WebsiteDetail & Document;

