import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { UsersDataService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-reject-user-account-modal',
  templateUrl: './reject-user-account-modal.component.html',
  styleUrl: './reject-user-account-modal.component.css'
})
export class RejectUserAccountModalComponent {
  dialogData: any;
  dataStoreInformation$: Observable<any>;
  saving: boolean = false;
  isCurrentUsernameValid: boolean = false;
  currentUsername: string;
  validityCheckMessage: string;

  constructor(
    private dialogRef: MatDialogRef<RejectUserAccountModalComponent>,
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


}
