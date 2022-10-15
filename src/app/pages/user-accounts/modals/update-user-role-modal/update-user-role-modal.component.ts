import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-role-modal',
  templateUrl: './update-user-role-modal.component.html',
  styleUrls: ['./update-user-role-modal.component.css'],
})
export class UpdateUserRoleModalComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<UpdateUserRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  confirmUserRoleUpdate() {
    this.matDialogRef.close();
  }
}
