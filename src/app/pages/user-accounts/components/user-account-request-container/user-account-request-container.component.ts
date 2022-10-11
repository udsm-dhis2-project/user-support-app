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

  get isSecondTier(): boolean {
    return (
      (
        (this.currentUser?.userGroups || []).filter(
          (userGroup) =>
            (
              this.configurations?.tier2?.filter(
                (tier) => tier?.id === userGroup?.id
              ) || []
            )?.length > 0
        ) || []
      )?.length > 0
    );
  }

  get isFeedbackRecepient(): boolean {
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
