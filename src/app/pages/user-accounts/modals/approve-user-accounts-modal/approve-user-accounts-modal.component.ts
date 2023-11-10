import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { omit, flatten } from 'lodash';
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
  isCurrentUsernameValid: boolean = false;
  currentUsername: string;
  validityCheckMessage: string;
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
    console.log('DATA', this.dialogData);
    this.getRequestInformation();
  }

  getRequestInformation(): void {
    this.dataStoreInformation$ = this.dataStoreDataService.getKeyData(
      this.dialogData?.request?.id
    );
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onTier2Approve(event: Event, userToApprove: any, request: any): void {
    event.stopPropagation();
    this.saving = true;

    this.messageAndDataStoreService
      .searchMessageConversationByTicketNumber(
        this.dialogData?.request?.ticketNumber
      )
      .subscribe((response) => {
        if (response && response != 'none') {
          const messageConversation = response;
          const data = {
            id: request?.id,
            method: 'POST',
            userPayload: null,
            messageConversation: {
              ...messageConversation,
              approvalMessage: `I do confirm account for ${
                userToApprove?.firstName + ' ' + userToApprove?.surname
              } whose phone number is ${
                userToApprove?.phoneNumber
              } should be created`,
            },
            payload: {
              ...this.dialogData?.request,
              payload: request?.payload?.map((user) => {
                if (user?.referenceId === userToApprove?.referenceId) {
                  return {
                    ...user,
                    status: 'APPROVED',
                    password:
                      this.dialogData?.configurations?.usersSettings
                        ?.defaultPassword,
                  };
                } else {
                  return user;
                }
              }),
            },
          };

          this.usersDataService.approveChanges(data).subscribe((response) => {
            if (response) {
              this.getRequestInformation();
              this.saving = false;
            }
          });
        } else {
          const messageBody = {
            subject: request?.message?.subject,
            users: [
              {
                id: request?.user?.id,
                username: request?.user?.username,
                type: 'user',
              },
            ],
            userGroups: [],
            organisationUnits: [],
            text: `Approval for a request account message sent from you \n\n ${request?.message?.message}`,
            attachments: [],
          };

          const data = {
            id: request?.id,
            method: 'POST',
            userPayload: null,
            messageBody: messageBody,
            payload: {
              ...this.dialogData?.request,
              payload: request?.payload?.map((user) => {
                if (user?.referenceId === userToApprove?.referenceId) {
                  return {
                    ...user,
                    status: 'APPROVED',
                    password:
                      this.dialogData?.configurations?.usersSettings
                        ?.defaultPassword,
                  };
                } else {
                  return user;
                }
              }),
            },
          };

          this.usersDataService.approveChanges(data).subscribe((response) => {
            if (response) {
              this.getRequestInformation();
              this.saving = false;
            }
          });
        }
      });
  }

  onUpdateUser(event: Event, request: any): void {
    event.stopPropagation();
    // console.log(request);
    this.saving = true;

    this.messageAndDataStoreService
      .searchMessageConversationByTicketNumber(request?.ticketNumber)
      .subscribe((response) => {
        if (response && response != 'none') {
          const messageConversation = response;
          const data = {
            id: request?.id,
            method: request?.method,
            url: request?.url,
            messageConversation: {
              ...messageConversation,
              approvalMessage: request?.replyMessage,
            },
            payload: request?.payload,
          };
          // console.log('data', data);
          console.log('>>>>>>>>Inside the request');
          this.usersDataService.approveChanges(data).subscribe((response) => {
            if (response) {
              this.getRequestInformation();
              this.saving = false;
              setTimeout(() => {
                this.dialogRef.close(true);
              });
            }
          });
        } else {
          // Logic to first create approval message
        }
      });
  }

  onApprove(event: Event, userToApprove: any, request: any): void {
    event.stopPropagation();
    this.saving = true;
    // Create potential usernames
    const countOfUsersRemainedToCreate = (
      request?.payload?.filter((user) => user?.status !== 'CREATED') || []
    )?.length;
    const potentialUserNames = [1, 2, 3].map((key) => {
      return {
        key,
        username: (
          userToApprove?.firstName.substring(0, key) + userToApprove?.surname
        ).toLowerCase(),
      };
    });
    this.messageAndDataStoreService
      .searchMessageConversationByTicketNumber(
        this.dialogData?.request?.ticketNumber
      )
      .subscribe((response) => {
        if (response && response != 'none') {
          const messageConversation = response;
          const selectedUsername = this.currentUsername;
          if (this.currentUsername) {
            const data = {
              id: request?.id,
              method: 'POST',
              userPayload: omit(
                {
                  ...userToApprove,
                  userCredentials: {
                    ...userToApprove?.userCredentials,
                    password:
                      this.dialogData?.configurations?.usersSettings
                        ?.defaultPassword,
                    username: selectedUsername,
                    userRoles:
                      userToApprove?.userCredentials?.userRoles?.filter(
                        (role) => role?.id != ''
                      ) || [
                        {
                          id: 'ZI4hVQsL7Dq',
                        },
                      ],
                  },
                  userGroups: [
                    ...userToApprove?.userGroups,
                    ...flatten(
                      (
                        this.dialogData?.configurations?.allowedUserGroupsForRequest?.filter(
                          (group) =>
                            userToApprove?.userGroups[0]?.id === group?.id
                        ) || []
                      )?.map((userGroup) => {
                        return userGroup?.associatedGroups.map((group) => {
                          return !group?.id
                            ? null
                            : {
                                id: group?.id,
                              };
                        });
                      })
                    ),
                  ]?.filter((group) => group && group?.id != '') || [
                    {
                      id: 'zk2Zubvm2kP',
                    },
                  ],
                  dataViewOrganisationUnits:
                    userToApprove?.dataViewOrganisationUnits?.length > 0
                      ? userToApprove?.dataViewOrganisationUnits?.map((ou) => {
                          return {
                            id: ou?.id,
                          };
                        })
                      : [{ id: request?.user?.organisationUnits[0]?.id }],
                  organisationUnits:
                    userToApprove?.organisationUnits?.length > 0
                      ? userToApprove?.organisationUnits?.map((ou) => {
                          return {
                            id: ou?.id,
                          };
                        })
                      : [{ id: request?.user?.organisationUnits[0]?.id }],
                },
                ['referenceId', 'status', 'username', 'password']
              ),
              messageConversation: {
                ...messageConversation,
                approvalMessage: `The following are the accounts created \n\n 0. ${
                  userToApprove?.firstName +
                  ' ' +
                  userToApprove?.surname +
                  '  - ' +
                  userToApprove?.phoneNumber
                }  is: username=  ${selectedUsername} and password = ${
                  this.dialogData?.configurations?.usersSettings
                    ?.defaultPassword
                }\n ${(request?.payload?.filter((user) => user?.username) || [])
                  ?.map((userPayload, index) => {
                    return (
                      index +
                      1 +
                      '. ' +
                      userPayload?.firstName +
                      ' ' +
                      userPayload?.surname +
                      ' - ' +
                      userPayload?.phoneNumber +
                      ' is ' +
                      userPayload?.username +
                      ' and password is ' +
                      userPayload?.password
                    );
                  })
                  .join('\n')}`,
              },
              payload: {
                ...this.dialogData?.request,
                payload: request?.payload?.map((user) => {
                  if (user?.referenceId === userToApprove?.referenceId) {
                    return {
                      ...user,
                      status: 'CREATED',
                      username: selectedUsername,
                      password:
                        this.dialogData?.configurations?.usersSettings
                          ?.defaultPassword,
                    };
                  } else {
                    return user;
                  }
                }),
              },
            };

            this.usersDataService.approveChanges(data).subscribe((response) => {
              if (response) {
                this.currentUsername = null;
                // If datastore key is complete please delete
                if (countOfUsersRemainedToCreate == 1) {
                  // delete first
                  this.dataStoreDataService
                    .deleteDataStoreKey(request?.id)
                    .subscribe((response) => {
                      this.getRequestInformation();
                      this.saving = false;
                      setTimeout(() => {
                        this.dialogRef.close(true);
                      });
                    });
                } else {
                  this.getRequestInformation();
                  this.saving = false;
                }
              }
            });
          } else {
            this.saving = false;
          }
        } else {
          const selectedUsername = this.currentUsername;
          if (selectedUsername) {
            const messageBody = {
              subject: request?.message?.subject,
              users: [
                {
                  id: request?.user?.id,
                  username: request?.user?.username,
                  type: 'user',
                },
              ],
              userGroups: [],
              organisationUnits: [],
              text: `The following are the accounts created \n\n 0. ${
                userToApprove?.firstName +
                ' ' +
                userToApprove?.surname +
                '  - ' +
                userToApprove?.phoneNumber
              }  is: username=  ${selectedUsername} and password = ${
                this.dialogData?.configurations?.usersSettings?.defaultPassword
              }\n ${(request?.payload?.filter((user) => user?.username) || [])
                ?.map((userPayload, index) => {
                  return (
                    index +
                    1 +
                    '. ' +
                    userPayload?.firstName +
                    ' ' +
                    userPayload?.surname +
                    ' - ' +
                    userPayload?.phoneNumber +
                    ' is ' +
                    userPayload?.username +
                    ' and password is ' +
                    userPayload?.password
                  );
                })
                .join('\n')}`,
              attachments: [],
            };
            const data = {
              id: request?.id,
              method: 'POST',
              userPayload: omit(
                {
                  ...userToApprove,
                  userCredentials: {
                    ...userToApprove?.userCredentials,
                    password:
                      this.dialogData?.configurations?.usersSettings
                        ?.defaultPassword,
                    username: selectedUsername,
                    userRoles:
                      userToApprove?.userCredentials?.userRoles?.filter(
                        (role) => role?.id != ''
                      ) || [
                        {
                          id: 'ZI4hVQsL7Dq',
                        },
                      ],
                  },
                  userGroups: [
                    ...userToApprove?.userGroups,
                    ...flatten(
                      (
                        this.dialogData?.configurations?.allowedUserGroupsForRequest?.filter(
                          (group) =>
                            userToApprove?.userGroups[0] &&
                            userToApprove?.userGroups[0]?.id === group?.id
                        ) || []
                      )?.map((userGroup) => {
                        return userGroup?.associatedGroups &&
                          userGroup?.associatedGroups?.length > 0
                          ? userGroup?.associatedGroups.map((group) => {
                              return !group?.id
                                ? null
                                : {
                                    id: group?.id,
                                  };
                            })
                          : [];
                      })
                    ),
                  ]?.filter((group) => group && group?.id != '') || [
                    {
                      id: 'zk2Zubvm2kP',
                    },
                  ],
                  dataViewOrganisationUnits:
                    userToApprove?.dataViewOrganisationUnits?.length > 0
                      ? userToApprove?.dataViewOrganisationUnits?.map((ou) => {
                          return {
                            id: ou?.id,
                          };
                        })
                      : [{ id: request?.user?.organisationUnits[0]?.id }],
                  organisationUnits:
                    userToApprove?.organisationUnits?.length > 0
                      ? userToApprove?.organisationUnits?.map((ou) => {
                          return {
                            id: ou?.id,
                          };
                        })
                      : [{ id: request?.user?.organisationUnits[0]?.id }],
                },
                ['referenceId', 'status', 'username', 'password']
              ),
              messageBody,
              payload: {
                ...this.dialogData?.request,
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

            this.usersDataService.approveChanges(data).subscribe((response) => {
              if (response) {
                this.currentUsername = null;
                // If datastore key is complete please delete
                if (countOfUsersRemainedToCreate == 1) {
                  // delete first
                  this.dataStoreDataService
                    .deleteDataStoreKey(request?.id)
                    .subscribe((response) => {
                      this.getRequestInformation();
                      this.saving = false;
                      setTimeout(() => {
                        this.dialogRef.close(true);
                      });
                    });
                } else {
                  this.getRequestInformation();
                  this.saving = false;
                }
              }
            });
          } else {
            this.saving = false;
          }
        }
      });
  }

  onGetUsernameData(username: string): void {
    this.currentUsername = username;
  }
  onGetUsernameValidity(isValid: boolean): void {
    this.isCurrentUsernameValid = isValid;
  }

  onGetvalidityCheckMessage(message: string): void {
    this.validityCheckMessage = message;
  }
}
