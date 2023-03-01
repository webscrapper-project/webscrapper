import {BaseSchema} from "../../common/schema/base.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema({
    collection: 'website',
})
export class Website extends BaseSchema {
    @Prop({
        type: "string",
        required: true,
    })
    url: string;

    @Prop({
        type: "boolean",
        required: true
    })
    status: boolean;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);

export type WebsiteDocument = Website & Document;

