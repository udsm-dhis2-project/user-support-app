import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shared-confirmation-modal',
  templateUrl: './shared-confirmation-modal.component.html',
  styleUrl: './shared-confirmation-modal.component.css',
})
export class SharedConfirmationModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SharedConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirm(event: Event): void {
    this.dialogRef.close(true);
  }
}
