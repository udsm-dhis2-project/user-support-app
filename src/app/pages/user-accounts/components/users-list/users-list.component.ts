import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UsersDataService } from 'src/app/core/services/users.service';
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
}
