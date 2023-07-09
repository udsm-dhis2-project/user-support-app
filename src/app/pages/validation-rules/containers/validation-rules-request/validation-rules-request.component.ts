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
    // console.log(this.configurations);
    // console.log(this.systemConfigs);
    this.canApprove =
      this.currentUser?.keyedAuthorities['VALIDATION_RULE_APPROVE'];
    this.canRequest =
      this.currentUser?.keyedAuthorities['VALIDATION_RULE_REQUEST'];
  }
}
