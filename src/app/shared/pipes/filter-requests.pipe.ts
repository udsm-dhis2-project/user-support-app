import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterFormRequests',
})
export class FilterFormRequestsPipe implements PipeTransform {
  transform(values: any[], filteringKey: string, filteringValue: string): any {
    if (!filteringKey || !filteringValue) {
      return values;
    }
    return (
      values.filter((value) => value[filteringKey] != filteringValue) || []
    );
  }
}
