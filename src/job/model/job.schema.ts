import {BaseSchema} from "../../common/schema/base.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema({
    collection: 'job',
})
export class Job extends BaseSchema {
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

export const JobSchema = SchemaFactory.createForClass(Job);

export type JobDocument = Job & Document;

