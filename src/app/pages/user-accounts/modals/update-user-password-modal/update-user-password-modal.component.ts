import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-password-modal',
  templateUrl: './update-user-password-modal.component.html',
  styleUrls: ['./update-user-password-modal.component.css'],
})
export class UpdateUserPasswordModalComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<UpdateUserPasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  confirmPasswordChange() {
    this.matDialogRef.close();
  }
}
