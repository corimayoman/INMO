import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('search/parse')
  @ApiOperation({ summary: 'Parse natural language search query into filters' })
  async parseSearch(@Body('query') query: string) {
    return this.aiService.parseNaturalLanguageSearch(query);
  }

  @Post('description/enhance')
  @ApiOperation({ summary: 'Enhance a listing description' })
  async enhanceDescription(@Body() body: { description: string; propertyType: string; city: string; bedrooms?: number }) {
    const enhanced = await this.aiService.enhanceDescription(body.description, {
      propertyType: body.propertyType,
      city: body.city,
      bedrooms: body.bedrooms,
    });
    return { enhanced };
  }

  @Post('description/translate')
  @ApiOperation({ summary: 'Translate a listing description' })
  async translate(@Body() body: { text: string; targetLanguage: string }) {
    const translated = await this.aiService.translateDescription(body.text, body.targetLanguage);
    return { translated };
  }
}
