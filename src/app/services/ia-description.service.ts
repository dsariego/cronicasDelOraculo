import { inject, Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { CommonsService } from './commons.service';
import OpenAI, { OpenAIError } from 'openai';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class IaDescriptionService {

  _constants = inject(ConstantsService);
  _services = inject(CommonsService);

  private openai: OpenAI;

  constructor() {
    // Configura la instancia de OpenAI
    this.openai = new OpenAI({
      apiKey: `${environment.OPENAI_API_KEY}`, // Reemplaza con tu API key de OpenAI
      dangerouslyAllowBrowser: true
    });
  }

  async sendMessage(messages: { role: 'system' | 'user' | 'assistant'; content: string}[]): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [ ...messages],
        //stream: true
      });

      console.log(completion.choices[0].message.content);
      return completion;
    } catch (error) {
      console.error('Error al llamar a la API de OpenAI:', error);
      if (error instanceof OpenAIError) {
        console.log('Esperando antes de reintentar... ' +error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.sendMessage(messages);
      }
      return { error: 'Error al llamar a la API de OpenAI' };
    }
  }
}
