import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ApproveFeedbackService } from 'src/app/core/services/approve-feedback.service';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';

@Component({
  selector: 'app-respond-feedback',
  templateUrl: './respond-feedback.component.html',
  styleUrls: ['./respond-feedback.component.css'],
})
export class RespondFeedbackComponent implements OnInit {
  dialogData: any;
  viewDetails: boolean = false;
  savingData: boolean = false;
  messageConversation$: Observable<any>;
  successfullyApproved: boolean = false;
  savedData: boolean = false;
  missingKey: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<RespondFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private approveFeedbackService: ApproveFeedbackService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar,
    private dataStoreService: DataStoreDataService
  ) {
    this.dialogData = data;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    this.messageConversation$ =
      this.messageAndDataStoreService.searchMessageConversationByTicketNumber(
        this.dialogData?.ticketNumber
      );
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(this.successfullyApproved);
  }

  onSave(event: Event, data: any, messageConversation: any): void {
    event.stopPropagation();
    this.missingKey = false;
    // TODO: Use configurations for handling response messages

    this.dataStoreService.getKeyData(data?.id).subscribe((response) => {
      if (response) {
        this.savingData = true;
        this.savedData = false;
        this.approveFeedbackService
          .approveChanges({
            ...data,
            messageConversation,
            approvalMessage: 'Ombi lako limeshughulikiwa',
          })
          .subscribe((response) => {
            if (response) {
              this.successfullyApproved = true;
              this.savingData = false;
              this.savedData = true;
              this.openSnackBar('Successfully updated', 'Close');
              setTimeout(() => {
                this.dialogRef.close(true);
              }, 500);
              setTimeout(() => {
                this._snackBar.dismiss();
              }, 2000);
            }
          });
      } else {
        this.missingKey = true;
        this.openSnackBar('Feedback already attended', 'Close');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 500);
        setTimeout(() => {
          this._snackBar.dismiss();
        }, 2000);
      }
    });
  }

  toggleDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails = !this.viewDetails;
  }
}
