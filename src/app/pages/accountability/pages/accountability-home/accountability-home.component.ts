import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';
import { getSystemConfigs } from 'src/app/store/selectors/system-configurations.selectors';

@Component({
  selector: 'app-accountability-home',
  templateUrl: './accountability-home.component.html',
  styleUrl: './accountability-home.component.css',
})
export class AccountabilityHomeComponent implements OnInit {
  systemConfigs$: Observable<any>;
  configurations$: Observable<any>;
  currentUser$: Observable<any>;
  constructor(
    private store: Store<State>,
    private dataStoreService: DataStoreDataService
  ) {}

  ngOnInit(): void {
    this.systemConfigs$ = this.store.select(getSystemConfigs);
    this.configurations$ = this.dataStoreService.getUserSupportConfigurations();
    this.currentUser$ = this.store.select(getCurrentUser);
  }
}
