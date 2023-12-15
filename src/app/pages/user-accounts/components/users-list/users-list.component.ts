import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UsersDataService } from 'src/app/core/services/users.service';
import { UpdateUserActivationModalComponent } from '../../modals/update-user-activation-modal/update-user-activation-modal.component';
import { UpdateUserOrgunitModalComponent } from '../../modals/update-user-orgunit-modal/update-user-orgunit-modal.component';
import { UpdateUserPasswordModalComponent } from '../../modals/update-user-password-modal/update-user-password-modal.component';
import { UpdateUserRoleModalComponent } from '../../modals/update-user-role-modal/update-user-role-modal.component';
import { UploadUsersModalComponent } from '../../modals/upload-users-modal/upload-users-modal.component';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  usersResponse$: Observable<any>;
  pageSize: number = 10;
  page: number = 1;
  pageIndex: number = 0;
  searchingText: string;
  @Input() currentUser: any;
  @Input() systemConfigs: any;
  pageSizeOptions: number[] = [5, 10, 20, 25, 50, 100, 200];
  saving: boolean = false;
  constructor(
    private usersDataService: UsersDataService,
    private dialog: MatDialog,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsersList();
  }

  loadUsersList(): void {
    this.usersResponse$ = this.usersDataService.getUsersList(
      this.pageSize,
      this.page,
      this.searchingText,
      this.currentUser?.organisationUnits[0]?.id
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getUsers(event: any, pager: any): void {
    this.pageIndex = event.pageIndex;
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.loadUsersList();
  }

  searchUser(event: any): void {
    this.searchingText = event.target.value;
    this.page = 1;
    this.loadUsersList();
  }

  openUploadingPage(event: Event): void {
    event.stopPropagation();
    this.dialog.open(UploadUsersModalComponent, {
      minWidth: '30%',
    });
  }

  openUserActivateDialog(event: Event, user: any): void {
    this.dialog
      .open(UpdateUserActivationModalComponent, {
        minWidth: '30%',
        data: {
          user,
          header: 'Confirming',
          message: `Do you want to ${
            user?.userCredentials?.disabled ? ' activate ' : ' deactivate'
          } ${user?.name} (${user?.userCredentials?.username})`,
        },
      })
      .afterClosed()
      .subscribe((update?: boolean) => {
        if (update) {
          this.saving = true;
          const dataStoreKey =
            'UA' +
            Date.now() +
            '_' +
            this.currentUser?.organisationUnits[0]?.id;
          const dataForMessageAndDataStore = {
            id: dataStoreKey,
            ticketNumber: 'UA' + Date.now().toString(),
            action: `Respond to ${
              user?.userCredentials?.disabled ? 'activation ' : 'deactivation '
            } of ${user?.name} account requested by ${
              this.currentUser?.displayName
            }`,
            message: {
              message: `The following account was requested for ${
                user?.userCredentials?.disabled ? ' activation' : 'deactivation'
              }: \n\n  Username: ${user?.userCredentials?.username} \n Names: ${
                user?.name
              } \n Email: ${user?.email ? user?.email : ''}`,
              subject: 'UA' + Date.now().toString() + '- ACCOUNT REQUEST',
            },
            replyMessage: `Account ${user?.userCredentials?.username} for ${
              user?.name
            } has been ${
              user?.userCredentials?.disabled ? 'activated' : 'de-activated'
            }`,
            payload: {
              userCredentials: {
                disabled: user?.userCredentials?.disabled ? false : true,
              },
            },
            url: 'users/' + user?.id,
            type: user?.userCredentials?.disabled ? 'activate' : 'deactivate',
            method: 'PATCH',
            user: this.currentUser,
          };

          const messageData = {
            subject: dataForMessageAndDataStore?.message?.subject,
            messageType: 'TICKET',
            users: [],
            userGroups: [{ id: this.systemConfigs?.feedbackRecipients?.id }],
            organisationUnits: [],
            attachments: [],
            text: dataForMessageAndDataStore?.message?.message,
          };

          this.messageAndDataStoreService
            .createMessageAndUpdateDataStore(messageData, {
              id: dataStoreKey,
              user: {
                id: this.currentUser?.id,
                displayName: this.currentUser?.displayName,
                userName: this.currentUser?.userCredentials?.username,
                jobTitle: this.currentUser?.jobTitle,
                email: this.currentUser?.email,
                organisationUnits: this.currentUser?.organisationUnits,
                phoneNumber: this.currentUser?.phoneNumber,
              },
              message: dataForMessageAndDataStore?.message,
              ...dataForMessageAndDataStore,
            })
            .subscribe((response) => {
              this.saving = false;
              this.openSnackBar('Successfully sent the request', 'Close');
              setTimeout(() => {
                this._snackBar.dismiss();
                // this.router.navigate(['/user-accounts/list']);
              }, 2000);
            });
        }
      });
  }

  openUserPassResetDialog(user: any) {
    this.dialog
      .open(UpdateUserPasswordModalComponent, {
        minWidth: '25%',
        data: {
          user,
        },
      })
      .afterClosed()
      .subscribe((password: string) => {
        if (password) {
          const payload = {
            ...user,
            userCredentials: {
              ...user?.userCredentials,
              disabled: false,
              password: password,
            },
          };

          this.saving = true;
          const dataStoreKey =
            'UA' +
            Date.now() +
            '_' +
            this.currentUser?.organisationUnits[0]?.id;
          const dataForMessageAndDataStore = {
            id: dataStoreKey,
            ticketNumber: 'UA' + Date.now().toString(),
            action: `Respond to password reset request for user ${user?.name} as requested by ${this.currentUser?.displayName}`,
            message: {
              message: `The following account was requested for password reset: \n\n  Username: ${
                user?.userCredentials?.username
              } \n Names: ${user?.name} \n Email: ${
                user?.email ? user?.email : ''
              }`,
              subject: 'UA' + Date.now().toString() + '- PASSWORD RESET',
            },
            replyMessage: `Password for ${user?.userCredentials?.username} (${user?.name}) has been updated successfully. \n\n The password is ${password}`,
            payload: payload,
            url: 'users/' + user?.id,
            type: 'password',
            method: 'PUT',
            user: this.currentUser,
          };

          const messageData = {
            subject: dataForMessageAndDataStore?.message?.subject,
            messageType: 'TICKET',
            users: [],
            userGroups: [{ id: this.systemConfigs?.feedbackRecipients?.id }],
            organisationUnits: [],
            attachments: [],
            text: dataForMessageAndDataStore?.message?.message,
          };

          this.messageAndDataStoreService
            .createMessageAndUpdateDataStore(messageData, {
              id: dataStoreKey,
              user: {
                id: this.currentUser?.id,
                displayName: this.currentUser?.displayName,
                userName: this.currentUser?.userCredentials?.username,
                jobTitle: this.currentUser?.jobTitle,
                email: this.currentUser?.email,
                organisationUnits: this.currentUser?.organisationUnits,
                phoneNumber: this.currentUser?.phoneNumber,
              },
              message: dataForMessageAndDataStore?.message,
              ...dataForMessageAndDataStore,
            })
            .subscribe((response) => {
              this.saving = false;
              this.openSnackBar('Successfully sent the request', 'Close');
              setTimeout(() => {
                this._snackBar.dismiss();
                // this.router.navigate(['/user-accounts/list']);
              }, 2000);
            });
        }
      });
  }

  openUserOrgunitDialog() {
    this.dialog.open(UpdateUserOrgunitModalComponent, {
      width: '50%',
    });
  }

  openUserRoleDialog() {
    this.dialog.open(UpdateUserRoleModalComponent, {
      width: '50%',
    });
  }
}
