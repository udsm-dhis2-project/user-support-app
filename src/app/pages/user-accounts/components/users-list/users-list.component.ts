import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UsersDataService } from 'src/app/core/services/users.service';
import { UpdateUserActivationModalComponent } from '../../modals/update-user-activation-modal/update-user-activation-modal.component';
import { UpdateUserOrgunitModalComponent } from '../../modals/update-user-orgunit-modal/update-user-orgunit-modal.component';
import { UpdateUserPasswordModalComponent } from '../../modals/update-user-password-modal/update-user-password-modal.component';
import { UpdateUserRoleModalComponent } from '../../modals/update-user-role-modal/update-user-role-modal.component';
import { UploadUsersModalComponent } from '../../modals/upload-users-modal/upload-users-modal.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  usersResponse$: Observable<any>;
  pageSize: number = 10;
  currentPage: number = 1;
  searchingText: string;
  constructor(
    private usersDataService: UsersDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.usersResponse$ = this.usersDataService.getUsersList(
      this.pageSize,
      this.currentPage
    );
  }

  getUsers(event: Event, pager: any, action: string): void {
    event.stopPropagation();
    this.currentPage = action === 'next' ? pager?.page + 1 : pager?.page - 1;
    this.usersResponse$ = this.usersDataService.getUsersList(
      this.pageSize,
      this.currentPage
    );
  }

  searchUser(event: any): void {
    this.searchingText = event.target.value;
    this.currentPage = 1;
    this.usersResponse$ = this.usersDataService.getUsersList(
      this.pageSize,
      this.currentPage,
      this.searchingText
    );
  }

  openUploadingPage(event: Event): void {
    event.stopPropagation();
    this.dialog.open(UploadUsersModalComponent, {
      width: '50%',
    });
  }

  openUserActivateDialog() {
    this.dialog.open(UpdateUserActivationModalComponent, {
      width: '50%',
    });
  }

  openUserPassResetDialog() {
    this.dialog.open(UpdateUserPasswordModalComponent, {
      width: '50%',
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
