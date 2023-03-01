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
import {WebsiteService} from "../service/website.service";
import {CrawlRequestDto} from "../dto/crawl-request.dto";
import {ErrorResponse, SuccessResponse} from "../../common/types/http.response";
import {CrawlResponseDto} from "../dto/crawl-response.dto";
import {ErrorType} from "../../common/exception/global-exception.filter";
import {errors} from "../../common/exception/scrapper-exception";

@Controller({
  path: 'website',
  version: '1',
})
@ApiTags('Website')
@ApiExtraModels(
    CrawlResponseDto
)
export class WebsiteController {
  constructor(
      private readonly websiteService: WebsiteService
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
  async crawl(
      @Body() crawlRequestBody: CrawlRequestDto
  ):Promise<CrawlResponseDto> {
    return await this.websiteService.crawl(crawlRequestBody)
  }

  @ApiOperation({
    summary: 'Get Active crawl jobs for website URLs',
  })
  @Get()
  async getActiveJobs(){
    this.websiteService.getActiveCrawlJobs();
  }

  @ApiOperation({
    summary: 'Get crawl job status',
  })
  @ApiParam({
    name: "id",
    description: "Crawl Job Id"
  })
  @Get("status/:id")
  async getCrawlJobStatus(@Param() id){
    this.websiteService.getCrawlJobStatus(id);
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
    this.websiteService.cancelCrawlJob(id);
  }
}
