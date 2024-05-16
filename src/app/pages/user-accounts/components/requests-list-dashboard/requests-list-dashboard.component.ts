import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Store } from '@ngrx/store';
import { Observable, zip } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { UsersDataService } from 'src/app/core/services/users.service';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

@Component({
  selector: 'app-requests-list-dashboard',
  templateUrl: './requests-list-dashboard.component.html',
  styleUrls: ['./requests-list-dashboard.component.css'],
})
export class RequestsListDashboardComponent implements OnInit {
  @Input() configurations: any;
  @Input() currentUser: any;
  @Input() isSecondTier: boolean;
  @Input() isFeedbackRecepient: boolean;
  allDataForUserSupport$: Observable<any[]>;

  viewMoreDetails: any = {};
  saving: boolean = false;
  itemsToConfirm: any = {};
  alertMessages: any = {};
  searchingText: string;
  deletingRequest: boolean = false;
  translations$: Observable<any>;
  currentRequestCategory: string = 'pending';

  constructor(
    private dataStoreService: DataStoreDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private dialog: MatDialog,
    private usersDataService: UsersDataService,
    private httpClient: NgxDhis2HttpClientService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
    this.getRequests();
  }

  getRequests(): void {
    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      {
        ...this.configurations,
        category: 'UA',
        tier2: this.isSecondTier,
        userId: this.currentUser?.id,
        organisationUnitId: this.currentUser?.organisationUnits[0]?.id,
      }
    );
  }

  getRequestCategory(event: MatRadioChange): void {
    this.currentRequestCategory = event?.value;
  }

  onToggleDetails(event: Event, data: any) {
    event.stopPropagation();
    if (this.viewMoreDetails[data?.id]) {
      this.viewMoreDetails[data?.id] = null;
    } else {
      this.viewMoreDetails[data?.id] = data;
    }
  }

  onRemoveUser(event: Event, user: any, request, confirmed?: boolean): void {
    event.stopPropagation();
    const data = {
      ...request,
      payload:
        request?.payload?.filter(
          (userData) => userData?.referenceId != user?.referenceId
        ) || [],
    };

    if (confirmed) {
      this.saving = true;
      this.itemsToConfirm[user?.referenceId] = null;
      if (data?.payload?.length === 0) {
        this.dataStoreService
          .deleteDataStoreKey(data?.id)
          .subscribe((response) => {
            this.saving = false;
            this.itemsToConfirm = {};
            this.alertMessages = {};
            this.getRequests();
          });
      } else {
        this.messageAndDataStoreService
          .searchMessageConversationByTicketNumber(request?.ticketNumber)
          .subscribe((response) => {
            if (response) {
              const messageConversation = response;
              const data = {
                id: request?.id,
                method: 'POST',
                userPayload: null,
                messageConversation: {
                  ...messageConversation,
                  approvalMessage: `I do confirm remove of ${
                    user?.firstName + ' ' + user?.surname
                  } whose phone number is ${
                    user?.phoneNumber
                  } from account request i have done`,
                },
                payload: {
                  ...request,
                  payload: request?.payload?.filter(
                    (userData) => userData?.referenceId !== user?.referenceId
                  ),
                },
              };

              this.usersDataService
                .approveChanges(data)
                .subscribe((response) => {
                  if (response) {
                    this.getRequests();
                    this.saving = false;
                  }
                });
            }
          });

        // this.dataStoreService
        //   .updateDataStoreKey(request?.id, data)
        //   .subscribe((response) => {
        //     if (response) {
        //       this.getRequests();
        //       this.itemsToConfirm = {};
        //       this.alertMessages = {};
        //       this.saving = false;
        //     }
        //   });
      }
    } else {
      if (data?.payload?.length === 0) {
        // Message about to delete request
        this.alertMessages[user?.referenceId] =
          'You are about to delete the request';
      } else {
        this.alertMessages[user?.referenceId] =
          'You are about to remove the user';
      }

      this.itemsToConfirm[user?.referenceId] = user?.referenceId;
    }
  }

  onDeleteRequest(event: Event, request: any): void {
    event.stopPropagation();

    this.dialog
      .open(SharedConfirmationModalComponent, {
        minWidth: '20%',
        data: {
          title: 'Confirm request delete',
          message:
            'Are you sure to delete this request? If yes, provide reason',
          color: 'warn',
          captureReason: true,
        },
      })
      .afterClosed()
      .subscribe((confirmResponse?: any) => {
        if (confirmResponse?.confirmed) {
          this.deletingRequest = true;
          this.messageAndDataStoreService
            .searchMessageConversationByTicketNumber(request?.message?.subject)
            .subscribe((messageConversation: any) => {
              if (messageConversation && messageConversation !== 'none') {
                if (messageConversation) {
                  zip(
                    this.httpClient.post(
                      `messageConversations/${messageConversation?.id}`,
                      `Request has been deleted by ${this.currentUser?.name} (${this.currentUser?.email}/${this.currentUser?.phoneNumber})\n Reason: ${confirmResponse?.reason}`
                    ),
                    this.dataStoreService.deleteDataStoreKey(request?.id)
                  ).subscribe((responses: any[]) => {
                    if (!responses[1]?.error) {
                      this.deletingRequest = false;
                      this.getRequests();
                    } else {
                      // Handle error
                      this.deletingRequest = false;
                    }
                  });
                }
              }
            });
        }
      });
  }
}
