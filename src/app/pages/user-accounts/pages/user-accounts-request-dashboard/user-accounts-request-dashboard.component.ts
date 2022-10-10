import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';
import { getSystemConfigs } from 'src/app/store/selectors/system-configurations.selectors';

@Component({
  selector: 'app-user-accounts-request-dashboard',
  templateUrl: './user-accounts-request-dashboard.component.html',
  styleUrls: ['./user-accounts-request-dashboard.component.css'],
})
export class UserAccountsRequestDashboardComponent implements OnInit {
  configurations$: Observable<any>;
  currentUser$: Observable<any>;
  systemConfigs$: Observable<any>;
  constructor(
    private dataStoreDataService: DataStoreDataService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.configurations$ =
      this.dataStoreDataService.getUserSupportConfigurations();
    this.currentUser$ = this.store.select(getCurrentUser);
    this.systemConfigs$ = this.store.select(getSystemConfigs);
  }
}
