import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ApproveUserAccountsModalComponent } from '../approve-user-accounts-modal/approve-user-accounts-modal.component';
import { UsersDataService } from 'src/app/core/services/users.service';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-approval-update-password-modal',
  templateUrl: './approval-update-password-modal.component.html',
  styleUrl: './approval-update-password-modal.component.css',
})
export class ApprovalUpdatePasswordModalComponent {
  dialogData: any;
  saving: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ApprovalUpdatePasswordModalComponent>,
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
    // this.onApprove();
  }

  onApprove(): void {
    const request = this.dialogData?.request;

    console.log(request);

    this.usersDataService.approveChanges(request).subscribe((response) => {
      if (response) {
        console.log('response', response);
        this.saving = false;
      }
    });
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
