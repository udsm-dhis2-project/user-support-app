import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-orgunit-modal',
  templateUrl: './update-user-orgunit-modal.component.html',
  styleUrls: ['./update-user-orgunit-modal.component.css'],
})
export class UpdateUserOrgunitModalComponent implements OnInit {
  orgUnitFilterConfig: any = {
    singleSelection: true,
    showUserOrgUnitSection: false,
    showOrgUnitLevelGroupSection: false,
    showOrgUnitGroupSection: false,
    showOrgUnitLevelSection: false,
    reportUse: false,
    additionalQueryFields: [],
    batchSize: 400,
    closeOnDestroy: false,
    emitOnSelection: true,
    hideActionButtons: true,
  };
  selectedOrgUnitItems: any[] = [];

  constructor(
    private matDialogRef: MatDialogRef<UpdateUserOrgunitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onOrgUnitUpdate(selection: any, action: string): void {
    console.log(action);
    console.log(selection);
  }

  confirmOrgunitChange() {
    this.matDialogRef.close();
  }
}
