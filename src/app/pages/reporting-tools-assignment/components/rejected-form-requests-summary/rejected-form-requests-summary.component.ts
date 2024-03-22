import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

@Component({
  selector: 'app-rejected-form-requests-summary',
  templateUrl: './rejected-form-requests-summary.component.html',
  styleUrls: ['./rejected-form-requests-summary.component.css'],
})
export class RejectedFormRequestsSummaryComponent implements OnInit {
  @Input() keys: string[];
  currentRejectedFormRequest: any;
  rejectedFormRequests$: Observable<any>;
  translations$: Observable<any>;
  constructor(
    private dataStoreService: DataStoreDataService, 
    private store: Store<State>
    ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
    this.rejectedFormRequests$ = this.dataStoreService
      .findByKeys('dhis2-user-support', this.keys, null)
      .pipe(
        map((response) => {
          return (
            response?.data.filter(
              (request) => request?.status === 'REJECTED'
            ) || []
          ).map((req) => {
            return {
              ...req,
              rejectionReasonMessage: req?.rejectionReasonMessage
                ? req?.rejectionReasonMessage?.split('\n').join('<br />')
                : '',
            };
          });
        }),
        catchError((error) => of(error))
      );
  }

  setCurrentFormRequest(event: Event, formRequest: any): void {
    event.stopPropagation();
    this.currentRejectedFormRequest = formRequest;
  }
}
