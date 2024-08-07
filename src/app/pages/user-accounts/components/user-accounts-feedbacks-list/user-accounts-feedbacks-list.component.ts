import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { ApproveUserAccountsModalComponent } from '../../modals/approve-user-accounts-modal/approve-user-accounts-modal.component';
import { RejectUserAccountModalComponent } from '../../modals/reject-user-account-modal/reject-user-account-modal.component';
import { State } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';
import { ApprovalUpdatePasswordModalComponent } from '../../modals/approval-update-password-modal/approval-update-password-modal.component';
import { AcountActivationDeactivationModalComponent } from '../../modals/acount-activation-deactivation-modal/acount-activation-deactivation-modal.component';

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
  translations$: Observable<any>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
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

    if (request.type === 'password') {
      this.dialog
        .open(ApprovalUpdatePasswordModalComponent, {
          // minWidth: '50%',
          data: {
            request,
            configurations: this.configurations,
          },
        })
        .afterClosed()
        .subscribe((response) => {
          this.getUserRequests();
        });
    } else if (request.type === 'activate' || request.type === 'deactivate') {
      this.dialog
        .open(AcountActivationDeactivationModalComponent, {
          // minWidth: '50%',
          data: {
            request,
            configurations: this.configurations,
            isFeedbackRecepient,
            isSecondTier: this.isSecondTier,
          },
        })
        .afterClosed()
        .subscribe((response) => {
          this.getUserRequests();
        });
    } else {
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
  onOpenRejectModal(event: Event, data: any): void {
    event.stopPropagation();
    this.dialog
      .open(RejectUserAccountModalComponent, {
        minWidth: '50%',
        data: { ...data, actionType: 'REJECTED' },
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getUserRequests();
        }
      });
  }
}
