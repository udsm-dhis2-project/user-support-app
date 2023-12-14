import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItems',
})
export class FilterItemsPipe implements PipeTransform {
  transform(items: any[], itemsToFilter: any[]): any[] {
    if (!itemsToFilter || itemsToFilter?.length === 0) {
      return items;
    }

    return (
      items?.filter(
        (originalItem: any) =>
          (
            itemsToFilter?.filter(
              (item: any) => item?.id === originalItem?.id
            ) || []
          )?.length === 0
      ) || []
    );
  }
}
