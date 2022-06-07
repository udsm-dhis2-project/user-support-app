import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { RespondFeedbackComponent } from '../respond-feedback/respond-feedback.component';

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
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      this.configurations
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
        width: '30%',
        data: { ...data },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.allDataForUserSupport$ =
            this.dataStoreService.getAllFromNameSpace(
              'dataStore/dhis2-user-support',
              this.configurations
            );
        }
      });
  }

  onReject(event: Event, data: any): void {
    event.stopPropagation();
    this.dialog
      .open(RespondFeedbackComponent, {
        width: '30%',
        data: { ...data, actionType: 'REJECTED' },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.allDataForUserSupport$ =
            this.dataStoreService.getAllFromNameSpace(
              'dataStore/dhis2-user-support',
              this.configurations
            );
        }
      });
  }
}
