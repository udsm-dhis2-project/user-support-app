import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-account-request-container',
  templateUrl: './user-account-request-container.component.html',
  styleUrls: ['./user-account-request-container.component.css'],
})
export class UserAccountRequestContainerComponent implements OnInit {
  @Input() currentUser: any;
  @Input() systemConfigs: any;
  @Input() configurations: any;
  constructor() {}

  ngOnInit(): void {}

  get isFeedbackRecepient() {
    return (
      (
        (this.currentUser?.userGroups || []).filter(
          (userGroup) =>
            userGroup?.id === this.systemConfigs?.feedbackRecipients?.id
        ) || []
      )?.length > 0
    );
  }
}
