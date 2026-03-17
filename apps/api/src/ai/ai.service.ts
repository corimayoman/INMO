import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') });
  }

  /**
   * Parse natural language search query into structured filters.
   * e.g. "2-bedroom apartment under 300k near the beach in Spain"
   */
  async parseNaturalLanguageSearch(query: string): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
        messages: [
          {
            role: 'system',
            content: `You are a real estate search assistant. Parse the user's natural language query into structured search filters.
Return a JSON object with these optional fields:
- listingType: SALE | RENT | SHORT_TERM | COMMERCIAL | LAND | NEW_DEVELOPMENT
- propertyType: APARTMENT | HOUSE | VILLA | TOWNHOUSE | STUDIO | PENTHOUSE | DUPLEX | LOFT | OFFICE | RETAIL | LAND
- countryCode: ISO 2-letter code
- city: string
- neighborhood: string
- priceMin: number
- priceMax: number
- currency: string (default USD)
- bedroomsMin: number
- bedroomsMax: number
- builtAreaMin: number (sqm)
- builtAreaMax: number (sqm)
- hasPool: boolean
- hasGarden: boolean
- hasParking: boolean
- isPetFriendly: boolean
- isFurnished: boolean
- nearBeach: boolean (note only, not a filter field)
- nearMetro: boolean (note only)
Only include fields that are clearly mentioned. Return valid JSON only.`,
          },
          { role: 'user', content: query },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (err) {
      this.logger.error('AI search parse failed', err);
      return {};
    }
  }

  /**
   * Enhance a listing description for agents.
   */
  async enhanceDescription(raw: string, context: { propertyType: string; city: string; bedrooms?: number }): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
        messages: [
          {
            role: 'system',
            content: 'You are a professional real estate copywriter. Enhance the property description to be compelling, accurate, and SEO-friendly. Keep it under 300 words. Do not invent facts.',
          },
          {
            role: 'user',
            content: `Property: ${context.bedrooms || ''} bed ${context.propertyType} in ${context.city}\n\nOriginal description:\n${raw}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      return response.choices[0].message.content || raw;
    } catch {
      return raw;
    }
  }

  /**
   * Translate a listing description to target language.
   */
  async translateDescription(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
        messages: [
          {
            role: 'system',
            content: `Translate the following real estate listing description to ${targetLanguage}. Preserve formatting and tone.`,
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 600,
      });

      return response.choices[0].message.content || text;
    } catch {
      return text;
    }
  }

  /**
   * Get AI-powered property recommendations based on user preferences.
   */
  async getRecommendationContext(userPreferences: any): Promise<string> {
    return JSON.stringify({
      suggestedFilters: userPreferences,
      reasoning: 'Based on your saved searches and viewed properties',
    });
  }
}
