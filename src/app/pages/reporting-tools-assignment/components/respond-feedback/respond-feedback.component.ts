import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ApproveFeedbackService } from 'src/app/core/services/approve-feedback.service';
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
  constructor(
    private dialogRef: MatDialogRef<RespondFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private approveFeedbackService: ApproveFeedbackService,
    private messageAndDataStoreService: MessagesAndDatastoreService
  ) {
    this.dialogData = data;
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
    // TODO: Use configurations for handling response messages
    event.stopPropagation();
    this.savingData = true;
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
        }
      });
  }

  toggleDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails = !this.viewDetails;
  }
}
