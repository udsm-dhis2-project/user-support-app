import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';
import { SharedConfirmationModalComponent } from '../shared-confirmation-modal/shared-confirmation-modal.component';
import { UIDsFromSystemService } from 'src/app/core/services/get-uids-from-system.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-create-role-modal',
  templateUrl: './create-role-modal.component.html',
  styleUrl: './create-role-modal.component.css',
})
export class CreateRoleModalComponent implements OnInit {
  roleFields: any[];
  isFormValid: boolean = false;
  selectedItems: any[];
  adding: boolean = false;
  formValuesData: any;
  systemId$: Observable<string>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateRoleModalComponent>,
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog,
    private uidFromSystemService: UIDsFromSystemService
  ) {}
  ngOnInit(): void {
    this.selectedItems = this.data?.role
      ? this.data?.role?.associatedRoles || []
      : [];
    this.systemId$ = this.uidFromSystemService
      .getUidsFromSystem(1)
      .pipe(map((response: any) => response[0]));
    this.roleFields = [
      new Textbox({
        id: 'name',
        key: 'name',
        label: 'Name',
        value: this.data?.role?.name,
        required: true,
      }),
      new Textbox({
        id: 'description',
        key: 'description',
        label: 'Description',
        value: this.data?.role?.description,
        required: true,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    this.formValuesData = formValue.getValues();
    this.isFormValid = formValue.isValid;
  }

  onGetSelectedItems(items: any[]): void {
    this.selectedItems = items;
  }

  onSave(event: Event, id: string): void {
    event.stopPropagation();
    this.dialog
      .open(SharedConfirmationModalComponent, {
        minWidth: '20%',
        data: {
          title: 'Confirmation',
          message: `Are you sure to add ${this.formValuesData?.name?.value}?`,
        },
      })
      .afterClosed()
      .subscribe((shouldSave?: boolean) => {
        if (shouldSave) {
          this.adding = true;
          const configurations = {
            ...this.data?.configurations,
            allowedUserRolesForRequest: [
              ...(this.data?.role
                ? this.data?.configurations?.allowedUserRolesForRequest?.filter(
                    (role: any) => role?.id !== this.data?.role?.id
                  ) || []
                : this.data?.configurations?.allowedUserRolesForRequest),
              {
                id: this.data?.role ? this.data?.role?.id : id,
                name: this.formValuesData?.name?.value,
                description: this.formValuesData?.description?.value,
                associatedRoles: this.selectedItems,
              },
            ],
          };

          this.dataStoreService
            .updateDataStoreKey(`configurations`, configurations)
            .subscribe((response: any) => {
              if (response) {
                this.adding = false;
                setTimeout(() => {
                  this.dialogRef.close(configurations);
                }, 100);
              }
            });
        }
      });
  }
}
