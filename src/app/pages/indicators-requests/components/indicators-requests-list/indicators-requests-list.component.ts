import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { catchError, map, Observable, of } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';

@Component({
  selector: 'app-indicators-requests-list',
  templateUrl: './indicators-requests-list.component.html',
  styleUrl: './indicators-requests-list.component.css',
})
export class IndicatorsRequestsListComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  indicatorsRequests$: Observable<any>;
  translations$: Observable<any>;
  loading: boolean = false;
  errorMessage: string;
  detailedRequests: any = {};
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog,
    private httpClient: NgxDhis2HttpClientService
  ) {}

  ngOnInit(): void {
    this.loadIndicatorsRequests();
  }

  loadIndicatorsRequests(): void {
    this.indicatorsRequests$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      { ...this.configurations, category: 'IND' }
    );
  }

  onViewDetails(event: Event, indicatorRequest: any): void {
    event.stopPropagation();
    this.detailedRequests[indicatorRequest?.id] = indicatorRequest;
  }

  onApprove(event: Event, indicatorRequest: any): void {
    event.stopPropagation();
    // console.log(indicatorRequest);
    this.dialog
      .open(SharedConfirmationModalComponent, {
        minWidth: '30%',
        data: {
          title: 'Confirmation',
          message: `Are you sure to confirm creation of indicator ${indicatorRequest?.payload?.name}?`,
          color: 'primary',
          buttonText: 'Yes',
        },
      })
      .afterClosed()
      .subscribe((confirmed?: boolean) => {
        if (confirmed) {
          this.loading = true;
          const indicator = indicatorRequest?.payload;
          (indicatorRequest?.method === 'POST' || indicator?.id
            ? this.httpClient.post('indicators', indicator)
            : this.httpClient.put(`indicators/${indicator?.id}.json`, indicator)
          )
            .pipe(
              map((response: any) => response),
              catchError((error: any) => {
                return of(error);
              })
            )
            .subscribe((response: any) => {
              if (response && response?.statusText !== 'Conflict') {
                this.loading = false;
                this.loadIndicatorsRequests();
                this.dataStoreService
                  .deleteDataStoreKey(`${indicatorRequest?.id}`)
                  .subscribe((response: any) => {
                    if (response) {
                      this.loading = false;
                      this.loadIndicatorsRequests();
                    }
                  });
              } else {
                this.errorMessage =
                  response?.response?.response?.error?.response?.errorReports[0]?.message;
                this.loading = true;
              }
            });
        }
      });
  }

  onReject(event: Event, indicatorRequest: any): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialog
      .open(SharedConfirmationModalComponent, {
        minWidth: '30%',
        data: {
          title: 'Rejection',
          message: `Are you sure to reject indicator ${indicatorRequest?.payload?.name} request?`,
          color: 'warn',
          buttonText: 'Yes',
        },
      })
      .afterClosed()
      .subscribe((confirmed?: boolean) => {
        if (confirmed) {
          this.loading = true;
          this.dataStoreService
            .deleteDataStoreKey(`${indicatorRequest?.id}`)
            .subscribe((response: any) => {
              if (response) {
                this.loading = false;
                this.loadIndicatorsRequests();
              }
            });
        }
      });
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.errorMessage = null;
    this.loading = false;
  }
}
