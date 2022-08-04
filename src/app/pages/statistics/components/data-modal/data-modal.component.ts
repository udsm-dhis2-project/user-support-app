import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css'],
})
export class DataModalComponent implements OnInit {
  dialogData: any;
  constructor(
    private dialogRef: MatDialogRef<DataModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }
}
