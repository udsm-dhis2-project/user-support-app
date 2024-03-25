import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-confirm-sending-accounts-request',
  templateUrl: './confirm-sending-accounts-request.component.html',
  styleUrls: ['./confirm-sending-accounts-request.component.css'],
})
export class ConfirmSendingAccountsRequestComponent implements OnInit {
translations$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<ConfirmSendingAccountsRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<State>
  ) {}

  ngOnInit(

  ): void {}

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(true);
  }
}
