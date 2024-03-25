import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-requested-validation-rules',
  templateUrl: './requested-validation-rules.component.html',
  styleUrls: ['./requested-validation-rules.component.css'],
})
export class RequestedValidationRulesComponent implements OnInit {
  @Input() configurations: any;
  @Input() currentUser: any;
  validationRulesRequests$: Observable<any[]>;
  detailedRequests: any = {};
translations$: Observable<any>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.validationRulesRequests$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      {
        ...this.configurations,
        category: 'VR',
      }
    );
  }

  onViewDetails(event: Event, validationRuleRequest: any): void {
    event.stopPropagation();
    this.detailedRequests[validationRuleRequest?.id] = validationRuleRequest;
  }
}
