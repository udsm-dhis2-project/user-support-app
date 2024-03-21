import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { duduceTheHighetLevelFromOus } from 'src/app/core/helpers/organisation-units.helpers';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { OrgUnitsProvisionalService } from 'src/app/core/services/organisationunits.service';
import { OrgUnitLevelsModel } from 'src/app/shared/models/organisation-units.model';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

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

  selectedTab = new UntypedFormControl(0);
  translations$: Observable<any>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private orgUnitsProvisionalService: OrgUnitsProvisionalService,
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    // console.log(this.currentUser);
    this.translations$ = this.store.select(getCurrentTranslations);

    const hightestLevel = duduceTheHighetLevelFromOus(
      this.currentUser?.organisationUnits
    );
    this.configurations = {
      ...this.configurations,
      showToggleFeedbackAndRequests: this.configurations
        ?.userGroupsToToggleFormRequests
        ? (
          (this.currentUser?.userGroups || []).filter(
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
    this.orgUnitLevels$ =
      this.orgUnitsProvisionalService.getOrgUnitLevels(hightestLevel);
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
    this.isFeedbackRecepient =
      (
        (this.currentUser?.userGroups || []).filter(
          (userGroup) =>
            userGroup?.id === this.systemConfigs?.feedbackRecipients?.id
        ) || []
      )?.length > 0 ||
      this.currentUser?.keyedAuthorities['US_FORM_REQUESTS_VIEW'] ||
      this.currentUser                                                                                                                                        ?.keyedAuthorities['US_FORM_APPROVE'];
  }

  changeTab(val, trans) {
    this.selectedTab.setValue(val);
  }

  onDataStoreChange(event: boolean, type: string, tabIndex?: number): void {
    if (event) {
      this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
    } else {
    }
    if (!type) {
      this.selectedTab.setValue(0);
    } else {
      this.selectedTab.setValue(tabIndex);
    }
  }

  toggleSupport(event: Event): void {
    event.stopPropagation();
    this.showRequest = !this.showRequest;
    this.isFeedbackRecepient = this.showRequest;
  }
}
