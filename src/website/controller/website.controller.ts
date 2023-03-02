import {
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';

@Controller({
  path: 'website',
  version: '1',
})
@ApiTags('Website')
export class WebsiteController {

}
