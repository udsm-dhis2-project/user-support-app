import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchItem',
})
export class SearchItemPipe implements PipeTransform {
  transform(values: any[], searchingText: string): any {
    if (!searchingText) {
      return values;
    }
    return (
      values.filter(
        (value) =>
          value?.name.toLowerCase()?.indexOf(searchingText.toLowerCase()) > -1
      ) || []
    );
  }
}
