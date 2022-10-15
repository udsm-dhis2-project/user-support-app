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
        if (response) {
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
        if (response) {
          const messageConversation = response;
          this.usersDataService
            .checkForUserNamesAvailability(potentialUserNames)
            .subscribe((response) => {
              if (response) {
                const selectedUsername = (response?.filter(
                  (data) => data?.username
                ) || [])[0]?.username;
                if (selectedUsername) {
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
                              return userGroup?.associatedGroups.map(
                                (group) => {
                                  return !group?.id
                                    ? null
                                    : {
                                        id: group?.id,
                                      };
                                }
                              );
                            })
                          ),
                        ]?.filter((group) => group && group?.id != '') || [
                          {
                            id: 'zk2Zubvm2kP',
                          },
                        ],
                        dataViewOrganisationUnits:
                          userToApprove?.dataViewOrganisationUnits?.length > 0
                            ? userToApprove?.dataViewOrganisationUnits?.map(
                                (ou) => {
                                  return {
                                    id: ou?.id,
                                  };
                                }
                              )
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
                      approvalMessage: `Account for ${
                        userToApprove?.firstName + ' ' + userToApprove?.surname
                      }  is: username=  ${selectedUsername} and password = ${
                        this.dialogData?.configurations?.usersSettings
                          ?.defaultPassword
                      }`,
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

                  this.usersDataService
                    .approveChanges(data)
                    .subscribe((response) => {
                      if (response) {
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
        } else {
          this.usersDataService
            .checkForUserNamesAvailability(potentialUserNames)
            .subscribe((response) => {
              if (response) {
                const selectedUsername = (response?.filter(
                  (data) => data?.username
                ) || [])[0]?.username;
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
                    text: `Account for ${
                      userToApprove?.firstName + ' ' + userToApprove?.surname
                    }  is: username=  ${selectedUsername} and password = ${
                      this.dialogData?.configurations?.usersSettings
                        ?.defaultPassword
                    }`,
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
                            ? userToApprove?.dataViewOrganisationUnits?.map(
                                (ou) => {
                                  return {
                                    id: ou?.id,
                                  };
                                }
                              )
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

                  this.usersDataService
                    .approveChanges(data)
                    .subscribe((response) => {
                      if (response) {
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
      });
  }
}
