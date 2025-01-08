import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commons',
  standalone: true
})
export class CommonsPipe implements PipeTransform {

  transform(items: any[], field: string, value: any): any[] {
    if (!items || !field || value === undefined || value === null) {
      return items;
    }
    return items.filter(item => item[field] === value);
  }

}
