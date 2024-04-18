import { Component, Input, OnInit } from '@angular/core';
import { sum } from 'lodash';

@Component({
  selector: 'app-users-total-display',
  templateUrl: './users-total-display.component.html',
  styleUrl: './users-total-display.component.css',
})
export class UsersTotalDisplayComponent implements OnInit {
  @Input() usersResponses: any;
  total: number;
  constructor() {}

  ngOnInit(): void {
    console.log(this.usersResponses);
    this.total = sum(
      this.usersResponses?.map((response: any) => response?.pager?.total)
    );
  }
}
