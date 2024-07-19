import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-indicators-list',
  templateUrl: './indicators-list.component.html',
  styleUrl: './indicators-list.component.css',
})
export class IndicatorsListComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  @Output() indicatorToEdit: EventEmitter<any> = new EventEmitter<any>();
  indicatorGroups$: Observable<any>;
  indicatorGroup: any;
  indicators$: Observable<any>;
  constructor(private httpClientService: NgxDhis2HttpClientService) {}

  ngOnInit(): void {
    this.indicatorGroups$ = this.httpClientService
      .get(
        `indicatorGroups.json?paging=false&fields=id,name,indicators[id,name,indicatorType]`
      )
      .pipe(
        map((response: any) => response?.indicatorGroups),
        catchError((error: any) => of(error))
      );
  }

  onGetIndicatorGroup(event: MatSelectChange): void {
    this.indicatorGroup = null;
    setTimeout(() => {
      this.indicatorGroup = event?.value;
    }, 40);
  }

  onEdit(event?: Event, indicator?: any): void {
    if (event) {
      event.stopPropagation();
    }
    this.indicatorToEdit.emit(indicator);
  }

  onDelete(event?: Event, indicator?: any): void {
    if (event) {
      event.stopPropagation();
    }
  }
}
