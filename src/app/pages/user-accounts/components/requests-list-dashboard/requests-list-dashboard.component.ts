import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-requests-list-dashboard',
  templateUrl: './requests-list-dashboard.component.html',
  styleUrls: ['./requests-list-dashboard.component.css'],
})
export class RequestsListDashboardComponent implements OnInit {
  @Input() configurations: any;
  allDataForUserSupport$: Observable<any[]>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      { ...this.configurations, category: 'UA' }
    );
  }
}
