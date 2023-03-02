import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsString} from "class-validator";

export class JobResponseDto {
    @ApiProperty({
        description: "Job ID",
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: "Website Url",
        example: "https://www.cinemaplus.az/az/cinema/about-cinemaplus/28-mall/"
    })
    @IsString()
    url: string;

    @ApiProperty({
        description: "Crawl Job Status",
        example: true
    })
    @IsBoolean()
    status: boolean
}
