import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  showRequest: boolean = false;

  selectedTab = new FormControl(0);
  constructor(
    private dataStoreService: DataStoreDataService,
    private orgUnitsProvisionalService: OrgUnitsProvisionalService
  ) {}

  ngOnInit(): void {
    this.configurations = {
      ...this.configurations,
      showToggleFeedbackAndRequests: this.configurations
        ?.userGroupsToToggleFormRequests
        ? (
            this.currentUser?.userGroups.filter(
              (userGroup) =>
                (
                  this.configurations?.userGroupsToToggleFormRequests.filter(
                    (group) => group?.id === userGroup?.id
                  ) || []
                )?.length > 0
            ) || []
          )?.length
        : false,
    };
    this.orgUnitLevels$ = this.orgUnitsProvisionalService.getOrgUnitLevels();
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
    // this.isFeedbackRecepient =
    //   (
    //     this.currentUser?.userGroups.filter(
    //       (userGroup) =>
    //         userGroup?.id === this.systemConfigs?.feedbackRecipients?.id
    //     ) || []
    //   )?.length > 0;
  }

  changeTab(val) {
    this.selectedTab.setValue(val);
  }

  onDataStoreChange(event: boolean, type: string): void {
    if (event) {
      this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
    } else {
    }
    if (!type) {
      this.selectedTab.setValue(0);
    } else {
      this.selectedTab.setValue(1);
    }
  }

  toggleSupport(event: Event): void {
    event.stopPropagation();
    this.showRequest = !this.showRequest;
    this.isFeedbackRecepient = this.showRequest;
  }
}
