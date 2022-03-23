import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersDataService } from 'src/app/core/services/users.service';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { FeedbackRecepientModel } from 'src/app/shared/models/users.model';

@Component({
  selector: 'app-reports-home-container',
  templateUrl: './reports-home-container.component.html',
  styleUrls: ['./reports-home-container.component.css'],
})
export class ReportsHomeContainerComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: SystemConfigsModel;
  users$: Observable<FeedbackRecepientModel[]>;
  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {
    console.log(this.systemConfigs);
    this.users$ = this.usersDataService.getUsersByUserGroup(
      this.systemConfigs?.feedbackRecipients?.id
    );
  }
}
