import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-validation-rules-request',
  templateUrl: './validation-rules-request.component.html',
  styleUrls: ['./validation-rules-request.component.css'],
})
export class ValidationRulesRequestComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  canRequest: boolean = false;
  canApprove: boolean = false;
  constructor() {}

  ngOnInit(): void {
    console.log(this.currentUser);
    console.log(this.configurations);
    console.log(this.systemConfigs);
    this.canApprove =
      (
        (this.currentUser?.userGroups || []).filter(
          (userGroup) =>
            this.configurations?.validationRuleRequest &&
            this.configurations?.validationRuleRequest?.userGroupsToApprove &&
            (
              this.configurations?.validationRuleRequest?.userGroupsToApprove?.filter(
                (userGroupToApprove) => userGroupToApprove?.id === userGroup?.id
              ) || []
            )?.length > 0
        ) || []
      )?.length > 0;

    if (!this.canApprove) {
      this.canRequest =
        (
          (this.currentUser?.userGroups || []).filter(
            (userGroup) =>
              this.configurations?.validationRuleRequest &&
              this.configurations?.validationRuleRequest?.userGroupsToRequest &&
              (
                this.configurations?.validationRuleRequest?.userGroupsToRequest?.filter(
                  (userGroupToRequest) =>
                    userGroupToRequest?.id === userGroup?.id
                ) || []
              )?.length > 0
          ) || []
        )?.length > 0;
    }
  }
}
