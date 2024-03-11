import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { ConfirmSendingAccountsRequestComponent } from '../confirm-sending-accounts-request/confirm-sending-accounts-request.component';

@Component({
  selector: 'app-update-user-role-modal',
  templateUrl: './update-user-role-modal.component.html',
  styleUrls: ['./update-user-role-modal.component.css'],
})
export class UpdateUserRoleModalComponent implements OnInit {
  selectedUserRoles: any[] = [];
  selectedUserGroups: any[] = [];

  constructor(
    private matDialogRef: MatDialogRef<UpdateUserRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  onConfirmUserRolesUpdate(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ConfirmSendingAccountsRequestComponent, {
        minWidth: '30%',
        data: {
          header: 'Confirming',
          message: `You are about to send user roles and groups Update request for user: ${this.data?.user?.name} , are you sure?`,
        },
      })
      .afterClosed()
      .subscribe((confirmed?: boolean) => {
        this.matDialogRef.close(
          confirmed
            ? {
                userRoles: this.selectedUserRoles,
                userGroups: this.selectedUserGroups,
              }
            : null
        );
      });
  }

  onGetSelectedUserRoles(selectedItemsList: any[]): void {
    this.selectedUserRoles = selectedItemsList;
  }

  onGetSelectedUserGroups(selectedItemsList: any[]): void {
    this.selectedUserGroups = selectedItemsList;
  }
}
