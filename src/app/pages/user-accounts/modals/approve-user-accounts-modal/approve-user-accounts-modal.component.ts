import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { omit } from 'lodash';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { UsersDataService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-approve-user-accounts-modal',
  templateUrl: './approve-user-accounts-modal.component.html',
  styleUrls: ['./approve-user-accounts-modal.component.css'],
})
export class ApproveUserAccountsModalComponent implements OnInit {
  dialogData: any;
  dataStoreInformation$: Observable<any>;
  saving: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ApproveUserAccountsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dataStoreDataService: DataStoreDataService,
    private usersDataService: UsersDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    console.log(this.dialogData);
    this.getRequestInformation();
  }

  getRequestInformation(): void {
    this.dataStoreInformation$ = this.dataStoreDataService.getKeyData(
      this.dialogData?.id
    );
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onApprove(event: Event, userToApprove: any, request: any): void {
    event.stopPropagation();
    this.saving = true;
    // Create potential usernames
    const potentialUserNames = [1, 2, 3].map((key) => {
      return {
        key,
        username: (
          userToApprove?.firstName.substring(0, key) + userToApprove?.surname
        ).toLowerCase(),
      };
    });
    this.messageAndDataStoreService
      .searchMessageConversationByTicketNumber(this.dialogData?.ticketNumber)
      .subscribe((response) => {
        if (response) {
          const messageConversation = response;

          this.usersDataService
            .checkForUserNamesAvailability(potentialUserNames)
            .subscribe((response) => {
              if (response) {
                const selectedUsername = (response?.filter(
                  (data) => data?.username
                ) || [])[0]?.username;
                console.log(response);
                console.log('selectedUsername', selectedUsername);
                if (selectedUsername) {
                  const data = {
                    id: request?.id,
                    method: 'POST',
                    userPayload: omit(
                      {
                        ...userToApprove,
                        userCredentials: {
                          ...userToApprove?.userCredentials,
                          username: selectedUsername,
                        },
                      },
                      'referenceId'
                    ),
                    messageConversation: {
                      ...messageConversation,
                      approvalMessage: `Account for ${
                        userToApprove?.firstName + ' ' + userToApprove?.surname
                      }  is: username=  ${selectedUsername} and password = ${
                        userToApprove?.userCredentials?.password
                      }`,
                    },
                    payload: {
                      ...this.dialogData,
                      payload: request?.payload?.map((user) => {
                        if (user?.referenceId === userToApprove?.referenceId) {
                          return {
                            ...user,
                            status: 'CREATED',
                            username: selectedUsername,
                            password: userToApprove?.userCredentials?.password,
                          };
                        } else {
                          return user;
                        }
                      }),
                    },
                  };
                  console.log(data);

                  // this.usersDataService
                  //   .approveChanges(data)
                  //   .subscribe((response) => {
                  //     if (response) {
                  //       this.saving = false;
                  //     }
                  //   });
                } else {
                  this.saving = false;
                }
              }
            });
        }
      });
  }
}
