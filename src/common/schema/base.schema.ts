import {Prop} from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';

export class BaseSchema{
    @Prop({
        type: 'string',
        required: true,
        default: function uuid() {
            return uuidv4();
        },
    })
    _id: string;

    @Prop({
        default: Date.now,
    })
    createdAt?: Date;
}
