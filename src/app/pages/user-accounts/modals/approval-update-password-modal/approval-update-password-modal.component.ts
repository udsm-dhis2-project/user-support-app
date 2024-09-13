import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersDataService } from 'src/app/core/services/users.service';

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
    private usersDataService: UsersDataService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {}

  onApprove(event: Event): void {
    event.stopPropagation();
    const request = this.dialogData?.request;
    this.saving = true;
    this.usersDataService.approveChanges(request).subscribe((response) => {
      if (response) {
        this.saving = false;
        this.dialogRef.close();
      }
    });
  }

  onReject(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
