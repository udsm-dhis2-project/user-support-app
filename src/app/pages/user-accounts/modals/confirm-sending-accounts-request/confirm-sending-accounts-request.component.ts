import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-sending-accounts-request',
  templateUrl: './confirm-sending-accounts-request.component.html',
  styleUrls: ['./confirm-sending-accounts-request.component.css'],
})
export class ConfirmSendingAccountsRequestComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ConfirmSendingAccountsRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(true);
  }
}
