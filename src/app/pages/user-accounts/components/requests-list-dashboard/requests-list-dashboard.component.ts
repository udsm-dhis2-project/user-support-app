import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { UsersDataService } from 'src/app/core/services/users.service';

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
  constructor(
    private dataStoreService: DataStoreDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private dialog: MatDialog,
    private usersDataService: UsersDataService
  ) {}

  ngOnInit(): void {
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
}
