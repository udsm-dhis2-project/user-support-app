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
  @Input() currentUser: any;
  @Input() isSecondTier: boolean;
  @Input() isFeedbackRecepient: boolean;
  allDataForUserSupport$: Observable<any[]>;
  moreOpenedDetails: any = {};
  searchingText: string = '';
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUserRequests();
  }

  getUserRequests(): void {
    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      {
        ...this.configurations,
        category: 'UA',
        tier2: this.isSecondTier,
        userId: this.currentUser?.id,
        organisationUnitId: this.currentUser?.organisationUnits[0]?.id,
        isFeedbackRecepient: this.isFeedbackRecepient,
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

  onOpenApprovalModal(event: Event, request, isFeedbackRecepient): void {
    event.stopPropagation();
    this.dialog
      .open(ApproveUserAccountsModalComponent, {
        minWidth: '50%',
        data: {
          request,
          configurations: this.configurations,
          isFeedbackRecepient,
          isSecondTier: this.isSecondTier,
        },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getUserRequests();
        }
      });
  }
}
