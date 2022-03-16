import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { OrgUnitsProvisionalService } from 'src/app/core/services/organisationunits.service';
import { OrgUnitLevelsModel } from 'src/app/shared/models/organisation-units.model';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';

@Component({
  selector: 'app-feedback-container',
  templateUrl: './feedback-container.component.html',
  styleUrls: ['./feedback-container.component.css'],
})
export class FeedbackContainerComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: SystemConfigsModel;
  isFeedbackRecepient: boolean = false;
  userSupportKeys$: Observable<string[]>;
  orgUnitLevels$: Observable<OrgUnitLevelsModel[]>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private orgUnitsProvisionalService: OrgUnitsProvisionalService
  ) {}

  ngOnInit(): void {
    this.orgUnitLevels$ = this.orgUnitsProvisionalService.getOrgUnitLevels();
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
    this.isFeedbackRecepient = this.configurations?.defaultToRequest
      ? false
      : (
          this.currentUser?.userGroups.filter(
            (userGroup) =>
              userGroup?.id === this.systemConfigs?.feedbackRecipients?.id
          ) || []
        )?.length > 0;
  }

  onDataStoreChange(event: boolean): void {
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
  }
}
