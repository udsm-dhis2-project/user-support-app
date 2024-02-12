import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, map } from 'rxjs';
import { uniqBy } from 'lodash';

@Component({
  selector: 'app-multiple-items-selection',
  templateUrl: './multiple-items-selection.component.html',
  styleUrl: './multiple-items-selection.component.css',
})
export class MultipleItemsSelectionComponent implements OnInit {
  @Input() resourceType: string;
  @Input() selectedItems: any[];
  @Output() selectedItemsList: EventEmitter<any[]> = new EventEmitter<any[]>();
  resources$: Observable<any>;
  constructor(private httpClientService: NgxDhis2HttpClientService) {}
  ngOnInit(): void {
    this.selectedItemsList.emit(this.selectedItems);
    this.getResources();
  }

  getResources(): void {
    this.resources$ = this.httpClientService
      .get(`${this.resourceType}.json?fields=id,name,code`)
      .pipe(
        map((response: any) => {
          return response[this.resourceType];
        })
      );
  }

  onSelectItem(event: Event, item: any, action: string): void {
    event.stopPropagation();
    // console.log(item);
    // console.log(action);
    if (action == 'select') {
      this.selectedItems = uniqBy([...this.selectedItems, item], 'id');
    } else {
      this.selectedItems =
        this.selectedItems?.filter(
          (selectedItem: any) => selectedItem?.id != item?.id
        ) || [];
    }
    this.selectedItemsList.emit(this.selectedItems);
  }
}
