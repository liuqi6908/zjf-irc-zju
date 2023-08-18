import { Global, Module } from '@nestjs/common'
import { EsAnalyzerService } from './es-analyzer.service'

@Global()
@Module({
  providers: [EsAnalyzerService],
  exports: [EsAnalyzerService],
})
export class EsAnalyzerModule {}
