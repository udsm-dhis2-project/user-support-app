import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-account-requests-home',
  templateUrl: './user-account-requests-home.component.html',
  styleUrls: ['./user-account-requests-home.component.css'],
})
export class UserAccountRequestsHomeComponent implements OnInit {
  @Input() configurations: any;
  @Input() currentUser: any;
  @Input() isSecondTier: boolean;
  constructor() {}

  ngOnInit() {}
}
