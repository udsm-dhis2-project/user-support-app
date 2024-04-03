import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { omit, flatten } from 'lodash';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { UsersDataService } from 'src/app/core/services/users.service';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';
import { DuplicateUserAccountsListModalComponent } from '../duplicate-user-accounts-list-modal/duplicate-user-accounts-list-modal.component';

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
  translations$: Observable<any>;
  selectedRequestForApproval: any;
  checkingForPotentialDuplicates: boolean = false;
  potentialDuplicatesByUserRequest: any = {};
  constructor(
    private dialogRef: MatDialogRef<ApproveUserAccountsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dataStoreDataService: DataStoreDataService,
    private usersDataService: UsersDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private store: Store<State>,
    private dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
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

  onAccountApprove(
    event: Event,
    userToApprove: any,
    request: any,
    shouldUseTier2: boolean
  ): void {
    event.stopPropagation();
    if (shouldUseTier2) {
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
    } else {
      // this.onApprove(null, userToApprove, request);
      this.selectedRequestForApproval = userToApprove;
    }
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
            privateMessage: request?.privateMessage,
            messageConversation: {
              ...messageConversation,
              approvalMessage: request?.replyMessage,
            },
            payload: request?.payload,
          };
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
    if (event) {
      event.stopPropagation();
    }
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
          // console.log('messageConversation', messageConversation);
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
                      (
                        flatten(
                          (
                            userToApprove?.userCredentials?.userRoles?.filter(
                              (role) => role?.id != ''
                            ) || []
                          )?.map((userRole: any) => {
                            return flatten(
                              (
                                this.dialogData?.configurations?.allowedUserRolesForRequest?.filter(
                                  (role: any) => role?.id === userRole?.id
                                ) || []
                              )?.map(
                                (configuredRole: any) =>
                                  configuredRole?.associatedRoles || []
                              ) || []
                            );
                          })
                        ) || []
                      )?.map((role: any) => {
                        return {
                          id: role?.id,
                        };
                      }) || [],
                  },
                  userGroups:
                    (
                      flatten(
                        (
                          userToApprove?.userGroups?.filter(
                            (group) => group?.id != ''
                          ) || []
                        )?.map((userGroup: any) => {
                          return flatten(
                            (
                              this.dialogData?.configurations?.allowedUserGroupsForRequest?.filter(
                                (group: any) => group?.id === userGroup?.id
                              ) || []
                            )?.map(
                              (configuredGroup: any) =>
                                configuredGroup?.associatedGroups || []
                            ) || []
                          );
                        })
                      ) || []
                    )?.map((group: any) => {
                      return {
                        id: group?.id,
                      };
                    }) || [],
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
                '  - Phone No.: ' +
                userToApprove?.phoneNumber +
                'and Email address: ' +
                userToApprove?.email
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
                    ' - Phone No.: ' +
                    userPayload?.phoneNumber +
                    ' and Email address ' +
                    userPayload?.email +
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

  onCheckPotentialDuplicate(event: Event, userDetails: any): void {
    event.stopPropagation();
    this.checkingForPotentialDuplicates = true;
    this.usersDataService
      .getUsersByEmailAndPhoneNumber(
        userDetails?.email,
        userDetails?.phoneNumber
      )
      .subscribe((potentialDuplicates: any[]) => {
        this.checkingForPotentialDuplicates = false;
        this.potentialDuplicatesByUserRequest[userDetails?.referenceId] =
          potentialDuplicates;
      });
  }

  onViewPotentialDuplicates(event: Event, potentialDuplicates: any[]): void {
    event.stopPropagation();
    this.dialog.open(DuplicateUserAccountsListModalComponent, {
      minWidth: '40%',
      data: potentialDuplicates,
    });
  }
}
