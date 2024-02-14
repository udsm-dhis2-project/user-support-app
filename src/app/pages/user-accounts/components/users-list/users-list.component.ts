import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { UsersDataService } from 'src/app/core/services/users.service';
import { UpdateUserActivationModalComponent } from '../../modals/update-user-activation-modal/update-user-activation-modal.component';
import { UpdateUserOrgunitModalComponent } from '../../modals/update-user-orgunit-modal/update-user-orgunit-modal.component';
import { UpdateUserPasswordModalComponent } from '../../modals/update-user-password-modal/update-user-password-modal.component';
import { UpdateUserRoleModalComponent } from '../../modals/update-user-role-modal/update-user-role-modal.component';
import { UploadUsersModalComponent } from '../../modals/upload-users-modal/upload-users-modal.component';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

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
  @Input() levels: any[];

  ouLevelsControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  selectedLevel: number;
  accountStatus: any;

  constructor(
    private usersDataService: UsersDataService,
    private dialog: MatDialog,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.options = this.levels;
    this.filteredOptions = this.ouLevelsControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
    this.loadUsersList();
  }

  displayFn(item: any): string {
    return item && item?.name ? item?.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option: any) =>
      option?.name.toLowerCase().includes(filterValue)
    );
  }

  onGetSelectedOption(event: MatAutocompleteSelectedEvent): void {
    this.selectedLevel = event?.option?.value?.level;
    this.loadUsersList();
  }

  getAccountStatus(event: MatRadioChange): void {
    this.accountStatus = event.value;
    this.loadUsersList();
  }

  loadUsersList(): void {
    this.usersResponse$ = this.usersDataService.getUsersList(
      this.pageSize,
      this.page,
      this.searchingText,
      this.currentUser?.organisationUnits[0]?.id,
      this.levels,
      this.selectedLevel,
      this.accountStatus
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
          message: `Do you want to ${user?.userCredentials?.disabled ? ' activate ' : ' deactivate'
            } ${user?.name} (${user?.userCredentials?.username})`,
        },
      })
      .afterClosed()
      .subscribe((update?: boolean) => {
        if (update) {
          this.saving = true;
          const action = user?.userCredentials?.disabled ? 'enabled' : 'disabled';
          const dataStoreKey =
            'UA' +
            Date.now() +
            '_' +
            this.currentUser?.organisationUnits[0]?.id;
          const dataForMessageAndDataStore = {
            id: dataStoreKey,
            ticketNumber: 'UA' + Date.now().toString(),
            action: `Respond to ${user?.userCredentials?.disabled ? 'activation ' : 'deactivation '
              } of ${user?.name} account requested by ${this.currentUser?.displayName
              }`,
            message: {
              message: `The following account was requested for ${user?.userCredentials?.disabled ? ' activation' : 'deactivation'
                }: \n\n  Username: ${user?.userCredentials?.username} \n Names: ${user?.name
                } \n Email: ${user?.email ? user?.email : ''}`,
              subject: 'UA' + Date.now().toString() + '- ACCOUNT REQUEST',
            },
            replyMessage: `Account ${user?.userCredentials?.username} for ${user?.name
              } has been ${user?.userCredentials?.disabled ? 'activated' : 'de-activated'
              }`,
            payload: {

            },
            url: 'users/' + user?.id + '/' + action,
            type: user?.userCredentials?.disabled ? 'activate' : 'deactivate',
            method: 'POST',
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
          const payload: any = [
            {
              op: 'add',
              path: '/password',
              value: password,
            },
            {
              op: 'add',
              path: '/attributeValues',
              value: [],
            },
          ];
          

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
              message: `The following account was requested for password reset: \n\n  Username: ${user?.userCredentials?.username
                } \n Names: ${user?.name} \n Email: ${user?.email ? user?.email : ''
                }`,
              subject: 'UA' + Date.now().toString() + '- PASSWORD RESET',
            },
            replyMessage: `Password for ${user?.userCredentials?.username} (${user?.name}) has been updated successfully. \n\n The password is ${password}`,
            payload: payload,
            url: 'users/' + user?.id,
            type: 'password',
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


