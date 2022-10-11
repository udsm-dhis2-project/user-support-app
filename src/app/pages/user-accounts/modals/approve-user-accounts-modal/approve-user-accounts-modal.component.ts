import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
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
    private usersDataService: UsersDataService
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
    console.log(userToApprove);
    this.saving = true;
    const data = {
      id: request?.id,
      userPayload: userToApprove,
      payload: request?.payload?.map((user) => {
        if (
          user?.userCredentials?.username ===
          userToApprove?.userCredentials?.username
        ) {
          return {
            ...user,
            status: 'CREATED',
            username: userToApprove?.userCredentials?.username,
            password: userToApprove?.userCredentials?.password,
          };
        }
      }),
    };
    console.log(data);
    this.usersDataService.approveChanges(data);
    setTimeout(() => {
      this.saving = false;
    }, 900);
  }
}
