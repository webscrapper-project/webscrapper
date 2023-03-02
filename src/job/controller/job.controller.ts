import {
  Body,
  Controller, Delete, Get, Param, Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation, ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {CrawlRequestDto} from "../dto/crawl-request.dto";
import {ErrorResponse, SuccessResponse} from "../../common/types/http.response";
import {CrawlResponseDto} from "../dto/crawl-response.dto";
import {ErrorType} from "../../common/exception/global-exception.filter";
import {errors} from "../../common/exception/scrapper-exception";
import {JobService} from "../service/job.service";
import {JobResponseDto} from "../dto/job-response.dto";

@Controller({
  path: 'job',
  version: '1',
})
@ApiTags('Crawl Jobs')
@ApiExtraModels(
    CrawlResponseDto
)
export class JobController {
  constructor(
      private readonly jobService: JobService
  ) {}

  @Post('crawl')
  @ApiOperation({
    summary: 'Enqueue a crawl job for the specified URL',
  })
  @ApiOkResponse({
    schema: SuccessResponse.getSchema({
      payload: CrawlResponseDto,
    }),
  })
  @ApiBadRequestResponse({
    schema: ErrorResponse.getSchema({
      errorType: ErrorType.SCRAPPER_ERROR,
      message: errors['UrlNotCorrect'].message,
    }),
  })
  @ApiBadRequestResponse({
    schema: ErrorResponse.getSchema({
      errorType: ErrorType.SCRAPPER_ERROR,
      message: errors['WebsiteAlreadyExist'].message,
    }),
  })
  async crawl(
      @Body() crawlRequestBody: CrawlRequestDto
  ):Promise<CrawlResponseDto> {
    return await this.jobService.crawl(crawlRequestBody)
  }

  @ApiOperation({
    summary: 'Get Active crawl jobs for website URLs',
  })
  @Get()
  async getActiveJobs(): Promise<JobResponseDto[]> {
    return await this.jobService.getActiveJobs();
  }

  @ApiOperation({
    summary: 'Get crawl job status',
  })
  @ApiParam({
    name: "id",
    description: "Crawl Job Id"
  })
  @Get("status/:id")
  async getCrawlJobStatus(@Param() id): Promise<JobResponseDto> {
    return await this.jobService.getWebsiteStatus(id);
  }

  @ApiOperation({
    summary: 'Cancel Crawl Job',
  })
  @ApiParam({
    name: "id",
    description: "Crawl Job Id"
  })
  @Delete('cancel/:id')
  async cancelCrawlJob(@Param() id){
    await this.jobService.cancelWebsiteCrawlJob(id);
  }
}
