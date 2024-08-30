import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'enumToText'
})
// Responsibility: TODO
export class EnumToTextPipe implements PipeTransform {
  transform(value: number, enumType: any): string {
    return enumType[value] || 'Unknown';
  }
}
