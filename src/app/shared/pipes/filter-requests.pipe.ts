import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterFormRequests',
})
export class FilterFormRequestsPipe implements PipeTransform {
  transform(
    values: any[],
    filteringKey: string,
    filteringValue: string,
    userId?: string
  ): any {
    if (!filteringKey || !filteringValue) {
      return values;
    }
    // First filter by use
    const dataToFilter = !userId
      ? values
      : values?.filter((value) => value?.user?.id === userId) || [];
    return (
      (dataToFilter || [])?.filter(
        (value) => value[filteringKey] != filteringValue
      ) || []
    );
  }
}
