import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStoreDataService } from '../../../../core/services/datastore.service';
import { SystemConfigsModel } from '../../../../shared/models/system-configurations.model';
import { State } from '../../../../store/reducers';
import { getCurrentUser } from '../../../../store/selectors';
import { getSystemConfigs } from '../../../../store/selectors/system-configurations.selectors';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css'],
})
export class UsersDashboardComponent implements OnInit {
  // @Input() currentUser: any;
  // @Input() configurations: any;
  // @Input() systemConfigs: SystemConfigsModel;

  currentUser$: Observable<any>;
  configurations$: Observable<any>;
  systemConfigs$: Observable<SystemConfigsModel>;

  constructor(
    private store: Store<State>,
    private dataStoreService: DataStoreDataService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.configurations$ = this.dataStoreService.getUserSupportConfigurations();
    this.systemConfigs$ = this.store.select(getSystemConfigs);
  }

  isFeedbackRecepient(currentUser, systemConfigs) {
    return (
      (
        currentUser?.userGroups.filter(
          (userGroup) => userGroup?.id === systemConfigs?.feedbackRecipients?.id
        ) || []
      )?.length > 0
    );
  }
}
