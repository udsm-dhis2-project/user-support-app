import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-activation-modal',
  templateUrl: './update-user-activation-modal.component.html',
  styleUrls: ['./update-user-activation-modal.component.css'],
})
export class UpdateUserActivationModalComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<UpdateUserActivationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
