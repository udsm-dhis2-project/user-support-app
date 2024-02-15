import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';

@Component({
  selector: 'app-update-user-role-modal',
  templateUrl: './update-user-role-modal.component.html',
  styleUrls: ['./update-user-role-modal.component.css'],
})
export class UpdateUserRoleModalComponent implements OnInit {
  selectedOptions: any = {}; 
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
        options: this.data?.configuration?.allowedUserRolesForRequest?.map(
          (role) => {
            return {
              id: role?.id,
              key: role?.id,
              label: role?.name,
              name: role?.name,
            };
          }
        
        ),
      }),
      new Dropdown({
        id: 'userGroup',
        key: 'userGroup',
        label: 'Groups',
        required: true,
        options: this.data?.configuration?.allowedUserGroupsForRequest?.map(
          (group) => {
            return {
              id: group?.id,
              key: group?.id,
              label: group?.name,
              name: group?.name,
            };
          }
        
        ),
      }),];
    }

    confirmUserRoleUpdate() {
      this.matDialogRef.close(this.selectedOptions); 
    }

    onFormUpdate(formvalue: FormValue) {
      this.selectedOptions = formvalue.getValues();
    }
}
