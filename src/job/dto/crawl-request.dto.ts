import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CrawlRequestDto{
    @ApiProperty({
        description: "Website Url",
        required: true,
        example: "https://www.cinemaplus.az/az/cinema/about-cinemaplus/28-mall/"
    })
    @IsString()
    url: string;
}
