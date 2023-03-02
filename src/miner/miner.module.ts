import { Module } from '@nestjs/common';
import { MinerService } from './service/miner.service';
import {WebsiteModule} from "../website/website.module";

@Module({
  imports: [WebsiteModule],
  providers: [MinerService],
  exports: [MinerService]
})
export class MinerModule {}
