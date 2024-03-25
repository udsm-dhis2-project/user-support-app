import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

@Component({
  selector: 'app-create-account-dashboard',
  templateUrl: './create-account-dashboard.component.html',
  styleUrls: ['./create-account-dashboard.component.css'],
})
export class CreateAccountDashboardComponent implements OnInit {
  configurations$: Observable<any>;
translations$: Observable<any>;
  constructor(private dataStoreDataService: DataStoreDataService, private store: Store<State>) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
    this.configurations$ =
      this.dataStoreDataService.getUserSupportConfigurations();
  }
}
