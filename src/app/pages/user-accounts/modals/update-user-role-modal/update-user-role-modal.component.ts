import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';

@Component({
  selector: 'app-update-user-role-modal',
  templateUrl: './update-user-role-modal.component.html',
  styleUrls: ['./update-user-role-modal.component.css'],
})
export class UpdateUserRoleModalComponent implements OnInit {

accessFormFields: Field<string>[];
  
  constructor(
    private matDialogRef: MatDialogRef<UpdateUserRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.accessFormFields = [
      new Dropdown({
        id: 'role',
        key: 'role',
        label: 'Role',
        required: true,
        options: [],
      }),
      new Dropdown({
        id: 'userGroup',
        key: 'userGroup',
        label: 'Groups',
        required: true,
        options: [],
      }),
    ];
  }

  confirmUserRoleUpdate() {
    this.matDialogRef.close();
  }
}
