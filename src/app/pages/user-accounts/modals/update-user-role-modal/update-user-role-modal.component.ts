import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  isAssigned: boolean = false;
  response: any;

  constructor(
    private matDialogRef: MatDialogRef<UpdateUserRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) { }

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
      // new Dropdown({
      //   id: 'userGroup',
      //   key: 'userGroup',
      //   label: 'Groups',
      //   required: true,
      //   options: this.data?.configuration?.allowedUserGroupsForRequest?.map(
      //     (group) => {
      //       return {
      //         id: group?.id,
      //         key: group?.id,
      //         label: group?.name,
      //         name: group?.name,
      //       };
      //     }

      //   ),
      // })
      ,];
  }

  confirmUserRoleUpdate() {

    this.response = {
      isAssigned: this.isAssigned,
      role: this.selectedOptions.role.value
    }

    this.matDialogRef.close(this.response);
  }

  onFormUpdate(formvalue: FormValue) {
    this.selectedOptions = formvalue.getValues();

    const roleAssigned = this.checkIfAlreadyAssigned(this.data.user.userRoles, this.selectedOptions.role.value,  'role');    

    this.isAssigned = roleAssigned

  }

checkIfAlreadyAssigned(options: any[], selectedValue: string, propertyName: string) {
  if (selectedValue) {
    for (let i = 0; i < options.length; i++) {
      
      if (options[i].id === selectedValue) {
        this.snackBar.open(`This ${propertyName} is already assigned`, 'Dismiss', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        return true; 
      }
    }
  }
  return false;
}

  
  
  
}
