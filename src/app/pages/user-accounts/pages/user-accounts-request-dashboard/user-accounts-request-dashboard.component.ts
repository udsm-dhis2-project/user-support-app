import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-user-accounts-request-dashboard',
  templateUrl: './user-accounts-request-dashboard.component.html',
  styleUrls: ['./user-accounts-request-dashboard.component.css'],
})
export class UserAccountsRequestDashboardComponent implements OnInit {
  configurations$: Observable<any>;
  constructor(private dataStoreDataService: DataStoreDataService) {}

  ngOnInit(): void {
    this.configurations$ =
      this.dataStoreDataService.getUserSupportConfigurations();
  }
}
