import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';
import { getSystemConfigs } from 'src/app/store/selectors/system-configurations.selectors';

@Component({
  selector: 'app-indicators-requests-home',
  templateUrl: './indicators-requests-home.component.html',
  styleUrl: './indicators-requests-home.component.css',
})
export class IndicatorsRequestsHomeComponent implements OnInit {
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
}
