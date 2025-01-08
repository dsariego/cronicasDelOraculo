import { inject, Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  constructor() { }

  _constants = inject(ConstantsService);
  //COMMON SERVICES

  playSound(audioPath: string): void {
    if(this._constants.isSoundsChecked){
      const audio = new Audio(audioPath);
      audio.play();
    }
  }

  playHoverSound(): void {
    this.playSound('assets/sounds/water-drop-sound.ogg');
  }

  playClickSound(): void {
    this.playSound('assets/sounds/sweet-magic.ogg');
  }

  playClickSoundItem(): void {
    this.playSound('assets/sounds/clicking-sound.ogg');
  }

  convertItemName(name: string): string {
    const itemNameMapping: { [key: string]: string } = {
      'adventure': 'Aventurero',
      'catacombs': 'Catacumbas',
      'chronicles': 'Crónicas',
      'forging': 'Forja',
      'codex': 'Códice',
      'oracle': 'Oráculo',
      'home': 'Crónicas del Oraculo',
    };
    return itemNameMapping[name] || name;
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  pluralize(word: string): string {
    const lowerWord = word.toLowerCase();

    if (word.endsWith('z')) {
      return word.slice(0, -1) + 'ces';
    } else if (word.endsWith('s') || word.endsWith('x')) {
      return word;
    } else if (word.endsWith('ión')) {
      return word.slice(0, -3) + 'iones';
    } else if (/[aeiouáéíóú]/.test(lowerWord[lowerWord.length - 1])) {
      return word + 's';
    } else {
      return word + 'es';
    }
  }

  hexToRgb(hex: string): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }

  getComplementaryColor(hex: string): string {
    const rgb = this.hexToRgb(hex);
    const [r, g, b] = rgb.split(',').map(Number);
    const complementaryRgb = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
    return complementaryRgb;
  }

  luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  getContrastRatio(hex1: string, hex2: string): number {
    const rgb1 = this.hexToRgb(hex1).split(',').map(Number);
    const rgb2 = this.hexToRgb(hex2).split(',').map(Number);

    const lum1 = this.luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = this.luminance(rgb2[0], rgb2[1], rgb2[2]);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  getBestTextColor(hex: string): string {
    const contrastWithWhite = this.getContrastRatio(hex, '#FFFFFF');
    const contrastWithBlack = this.getContrastRatio(hex, '#000000');

    // Devolver blanco o negro dependiendo de cuál ofrezca el mejor contraste
    return contrastWithWhite > contrastWithBlack ? '#FFFFFF' : '#000000';
  }

  generateRandomName(type: 'name' | 'nickName', gender: 'male' | 'female'): string {
    let response: string = '';
    if(type == 'name'){
      const firstName = gender === 'male'
      ? this._constants.FIRST_NAME_MALE[Math.floor(Math.random() * this._constants.FIRST_NAME_MALE.length)]
      : this._constants.FIRST_NAME_FEMALE[Math.floor(Math.random() * this._constants.FIRST_NAME_FEMALE.length)];
      const lastName = this._constants.LASTNAMES[Math.floor(Math.random() * this._constants.LASTNAMES.length)];
      response = `${firstName} ${lastName}`;
    }else if(type == 'nickName'){
      const nickname = gender === 'male'
      ? this._constants.NICKNAMES_MALE[Math.floor(Math.random() * this._constants.NICKNAMES_MALE.length)] :
      this._constants.NICKNAMES_FEMALE[Math.floor(Math.random() * this._constants.NICKNAMES_FEMALE.length)];
      response = `${nickname}`;
    }
    return response;
  }

  getRandomItemFromMap(map: { [key: string]: string[] }, count: number): string[] {
    const selectedKeys = new Set<string>();
    const selectedItems: string[] = [];
    const keys = Object.keys(map);
    const maxSelections = Math.min(count, keys.length);
    while (selectedItems.length < maxSelections) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      if (!selectedKeys.has(randomKey)) {
        selectedKeys.add(randomKey);
        const items = map[randomKey];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        if (!selectedItems.includes(randomItem)) {
          selectedItems.push(randomItem);
        }
      }
    }
    return selectedItems;
  }

  getFromLocalStorage<T>(key: string): T | null {
    if (typeof window !== 'undefined' && localStorage){
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        try {
          return JSON.parse(storedValue) as T;
        } catch (error) {
          console.error(`Error al parsear el valor de la clave ${key}:`, error);
          return null;
        }
      } else {
        console.log(`No se encontró el valor para la clave ${key}`);
        return null;
      }
    }
    return null;
  }

  saveToLocalStorage(key: string, value: any): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getRandomItem<T>(items: T[]): T {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  getRandomItems<T>(
    items: T[],
    count: number,
    filterField?: string,
    filterValue?: string
  ): T[] {
      let filteredItems = items;
      if (filterField && filterValue) {
          filteredItems = items.filter(item =>
              item[filterField as keyof T] === filterValue
          );
      }
      /*if (count > filteredItems.length) {
          throw new Error("El número de elementos solicitados excede el tamaño del array filtrado.");
      }*/
      const selectedItems: T[] = [];
      const usedIndices = new Set<number>();
      while (selectedItems.length < count) {
          const randomIndex = Math.floor(Math.random() * filteredItems.length);
          if (!usedIndices.has(randomIndex)) {
              usedIndices.add(randomIndex);
              selectedItems.push(filteredItems[randomIndex]);
          }
      }
      return selectedItems;
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray<T>(array: T[]): T[] {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
  }

}
