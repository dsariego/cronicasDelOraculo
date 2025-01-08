import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConstantsService } from './constants.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageGeneratorService {
  _constants = inject(ConstantsService);

  private apiUrl = this._constants.urlAPIImage;
  private apiKey = environment.openAIKey;

  constructor(private http: HttpClient) {}

  async generateImage(description: string): Promise<string> {
    const prompt = `
      Generar un retrato en blanco y negro con acentos de color específicos:
      $color-goldenrod (#DAA520), $color-steel-blue (#4682B4), $color-dark-red (#8B0000).
      Formato cuadrado, sin texto ni nombres, centrado en el aventurero con una ocupación de ${description}.
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      prompt: prompt,
      n: 1, // Número de imágenes
      size: '512x512', // Tamaño de la imagen
    };

    try {
      // La llamada a await está dentro del método async
      const response: any = await firstValueFrom(
        this.http.post(this.apiUrl, body, { headers })
      );
      return response.data[0].url; // Devuelve la URL de la imagen generada
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      throw error;
    }
  }
}
