import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRequestsByStatus',
})
export class FilterRequestsByStatusPipe implements PipeTransform {
  transform(requests: any[], status: string): any {
    if (!status) {
      return requests || [];
    }
    return (
      (requests || []).filter((request) => request?.status === status) || []
    );
  }
}
