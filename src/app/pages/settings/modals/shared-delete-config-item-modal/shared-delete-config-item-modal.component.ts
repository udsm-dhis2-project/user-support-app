import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shared-delete-config-item-modal',
  templateUrl: './shared-delete-config-item-modal.component.html',
  styleUrl: './shared-delete-config-item-modal.component.css',
})
export class SharedDeleteConfigItemModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SharedDeleteConfigItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(true);
  }
}
