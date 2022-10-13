import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterFormRequests',
})
export class FilterFormRequestsPipe implements PipeTransform {
  transform(
    values: any[],
    filteringKey: string,
    filteringValue: string,
    userId?: string,
    searchingText?: string
  ): any {
    if (!filteringKey || !filteringValue) {
      return values;
    }
    // First filter by use
    const dataToFilter =
      !userId && !searchingText
        ? values
        : searchingText && !userId
        ? (values || [])?.filter(
            (item) =>
              item?.searchingText
                ?.toLowerCase()
                ?.indexOf(searchingText?.toLowerCase()) > -1
          )
        : userId && !searchingText
        ? values?.filter((value) => value?.user?.id === userId) || []
        : values;
    return (
      (dataToFilter || [])?.filter(
        (value) => value[filteringKey] != filteringValue
      ) || []
    );
  }
}
