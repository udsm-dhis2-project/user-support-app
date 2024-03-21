import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { RespondFeedbackComponent } from '../respond-feedback/respond-feedback.component';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

@Component({
  selector: 'app-feedbacks-list',
  templateUrl: './feedbacks-list.component.html',
  styleUrls: ['./feedbacks-list.component.css'],
})
export class FeedbacksListComponent implements OnInit {
  @Input() currentUser: any;
  @Input() userSupportKeys: string[];
  @Input() configurations: any;
  @Input() systemConfigs: SystemConfigsModel;
  allDataForUserSupport$: Observable<any>;
  moreOpenedDetails: any = {};
  translations$: Observable<any>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog,
    private store: Store<State>,

  ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
    this.getFeedbacksList();
  }

  getFeedbacksList(): void {
    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      {
        ...this.configurations,
        category: 'DS',
      }
    );
  }

  toggleViewMore(event: Event, data: any) {
    event.stopPropagation();
    if (this.moreOpenedDetails[data?.id]) {
      this.moreOpenedDetails[data?.id] = null;
    } else {
      this.moreOpenedDetails[data?.id] = data;
    }
  }

  onApprove(event: Event, data: any): void {
    event.stopPropagation();
    this.dialog
      .open(RespondFeedbackComponent, {
        minWidth: '30%',
        data: { ...data, actionType: 'APPROVE' },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getFeedbacksList();
        }
      });
  }

  onReject(event: Event, data: any): void {
    event.stopPropagation();
    this.dialog
      .open(RespondFeedbackComponent, {
        minWidth: '30%',
        data: { ...data, actionType: 'REJECTED' },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getFeedbacksList();
        }
      });
  }

  onDelete(event: Event, data: any): void {
    event.stopPropagation();
    this.dialog
      .open(RespondFeedbackComponent, {
        minWidth: '30%',
        data: { ...data, actionType: 'REJECTED' },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getFeedbacksList();
        }
      });
  }
}
