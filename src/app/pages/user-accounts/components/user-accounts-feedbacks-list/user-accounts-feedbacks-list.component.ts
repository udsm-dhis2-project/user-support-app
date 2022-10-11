import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { ApproveUserAccountsModalComponent } from '../../modals/approve-user-accounts-modal/approve-user-accounts-modal.component';

@Component({
  selector: 'app-user-accounts-feedbacks-list',
  templateUrl: './user-accounts-feedbacks-list.component.html',
  styleUrls: ['./user-accounts-feedbacks-list.component.css'],
})
export class UserAccountsFeedbacksListComponent implements OnInit {
  @Input() configurations: any;
  allDataForUserSupport$: Observable<any[]>;
  moreOpenedDetails: any = {};
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      { ...this.configurations, category: 'UA' }
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

  onOpenApprovalModal(event: Event, request): void {
    event.stopPropagation();
    this.dialog.open(ApproveUserAccountsModalComponent, {
      width: '50%',
      data: request,
    });
  }
}
