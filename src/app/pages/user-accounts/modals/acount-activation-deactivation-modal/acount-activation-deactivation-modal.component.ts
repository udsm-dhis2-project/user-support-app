import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { UsersDataService } from 'src/app/core/services/users.service';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-acount-activation-deactivation-modal',
  templateUrl: './acount-activation-deactivation-modal.component.html',
  styleUrl: './acount-activation-deactivation-modal.component.css',
})
export class AcountActivationDeactivationModalComponent {
  dialogData: any;
  constructor(
    private dialogRef: MatDialogRef<AcountActivationDeactivationModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dataStoreDataService: DataStoreDataService,
    private usersDataService: UsersDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private store: Store<State>,
    private dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.approve();
  }


  approve(): void {
    // create a payload to push in a function and method type

    console.log(this.dialogData);

    // run a approve in a function using the payload
    this.usersDataService.approveChanges(this.dialogData?.request).subscribe((response) => {
      console.log('response', response);
    })

    // send message after all
    this.dataStoreDataService.deleteDataStoreKey(this.dialogData?.request?.id);
    
    // delete the attended ticket

    this.dialogRef.close();
  }
}
