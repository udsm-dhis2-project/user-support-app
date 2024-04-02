import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-duplicate-user-accounts-list-modal',
  templateUrl: './duplicate-user-accounts-list-modal.component.html',
  styleUrl: './duplicate-user-accounts-list-modal.component.css',
})
export class DuplicateUserAccountsListModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
