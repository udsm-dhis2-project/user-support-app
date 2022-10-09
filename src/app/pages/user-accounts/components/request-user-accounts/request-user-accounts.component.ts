import { Component, Input, OnInit } from '@angular/core';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Email } from 'src/app/shared/modules/form/models/email.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { TextArea } from 'src/app/shared/modules/form/models/text-area.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

@Component({
  selector: 'app-request-user-accounts',
  templateUrl: './request-user-accounts.component.html',
  styleUrls: ['./request-user-accounts.component.css'],
})
export class RequestUserAccountsComponent implements OnInit {
  @Input() configurations: any;
  @Input() currentUser: any;
  formFields: Field<string>[];
  accessFormFields: Field<string>[];
  formData: any = {};
  formDataToStoreLocally: any[] = [];

  isDemographicFormValid: boolean = false;
  isAccessControlFormValid: boolean = false;

  orgUnitFilterConfigForDataEntry: any = {
    singleSelection: false,
    showUserOrgUnitSection: false,
    showOrgUnitLevelGroupSection: false,
    showOrgUnitGroupSection: false,
    showOrgUnitLevelSection: false,
    reportUse: false,
    additionalQueryFields: [],
    batchSize: 400,
    closeOnDestroy: false,
    emitOnSelection: true,
    hideActionButtons: true,
  };

  orgUnitFilterConfigForReport: any = {
    singleSelection: false,
    showUserOrgUnitSection: false,
    showOrgUnitLevelGroupSection: false,
    showOrgUnitGroupSection: false,
    showOrgUnitLevelSection: false,
    reportUse: true,
    additionalQueryFields: [],
    batchSize: 400,
    closeOnDestroy: false,
    emitOnSelection: true,
    hideActionButtons: true,
  };
  selectedOrgUnitItemsForDataEntry: any[] = [];
  selectedOrgUnitItemsForReport: any[] = [];

  shouldConfirm: boolean = false;
  saving: boolean = false;

  currentUserToCreateSelected: string;
  readyToSave: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const storedUsersData = localStorage.getItem('usersToCreate');
    console.log(storedUsersData);
    if (storedUsersData) {
      this.formDataToStoreLocally = JSON.parse(storedUsersData);
      this.selectedOrgUnitItemsForDataEntry =
        this.formDataToStoreLocally[
          this.formDataToStoreLocally?.length - 1
        ]?.entryOrgUnits;
      this.selectedOrgUnitItemsForReport =
        this.formDataToStoreLocally[
          this.formDataToStoreLocally?.length - 1
        ]?.reportOrgUnits;
      this.currentUserToCreateSelected =
        this.formDataToStoreLocally[
          this.formDataToStoreLocally?.length - 1
        ]?.id;

      console.log(
        'currentUserToCreateSelected',
        this.currentUserToCreateSelected
      );
    }

    this.createDemographicFields(
      this.formDataToStoreLocally?.length > 0
        ? this.formDataToStoreLocally[this.formDataToStoreLocally?.length - 1]
        : null
    );
    this.createAccessControlFields(
      this.formDataToStoreLocally?.length > 0
        ? this.formDataToStoreLocally[this.formDataToStoreLocally?.length - 1]
        : null
    );
  }

  createDemographicFields(data?: any): void {
    this.formFields = [
      new Textbox({
        id: 'firstName',
        key: 'firstName',
        label: 'Firstname',
        required: true,
        value: data ? data?.firstName : null,
        options: [],
      }),
      new Textbox({
        id: 'middleName',
        key: 'middleName',
        label: 'Middlename',
        value: data ? data?.middleName : null,
        required: false,
        options: [],
      }),
      new Textbox({
        id: 'lastName',
        key: 'lastName',
        label: 'Lastname',
        value: data ? data?.lastName : null,
        required: true,
        options: [],
      }),
      new Email({
        id: 'email',
        key: 'email',
        label: 'Email',
        type: 'email',
        value: data ? data?.email : null,
        required: true,
      }),
      new Textbox({
        id: 'phoneNumber',
        key: 'phoneNumber',
        label: 'Phone number',
        type: 'phonenumber',
        value: data ? data?.phoneNumber : null,
        required: true,
      }),
      new Dropdown({
        id: 'title',
        key: 'title',
        label: 'Title',
        required: true,
        value: data ? data?.title : null,
        options: this.configurations?.referenceTitles?.map((title) => {
          return {
            id: title?.id,
            key: title?.id,
            label: title?.name,
            name: title?.name,
          };
        }),
      }),
      new TextArea({
        id: 'titleDescription',
        key: 'titleDescription',
        label: 'Title description',
        value: data ? data?.titleDescription : null,
      }),
    ];
  }

  createAccessControlFields(data?: any): void {
    this.accessFormFields = [
      new Dropdown({
        id: 'userRole',
        key: 'userRole',
        label: 'Role',
        required: true,
        value: data ? data?.userRoles[0]?.id : null,
        options: this.configurations?.allowedUserRolesForRequest?.map(
          (role) => {
            return {
              id: role?.id,
              key: role?.id,
              label: role?.name,
              name: role?.name,
            };
          }
        ),
      }),
      new Dropdown({
        id: 'userGroup',
        key: 'userGroup',
        label: 'Groups',
        required: true,
        value: data ? data?.userGroups[0]?.id : null,
        options: this.configurations?.allowedUserGroupsForRequest?.map(
          (group) => {
            return {
              id: group?.id,
              key: group?.id,
              label: group?.name,
              name: group?.name,
            };
          }
        ),
      }),
    ];
  }

  onUpdateDemographicForm(formvalue: FormValue): void {
    this.formData = { ...this.formData, ...formvalue.getValues() };
    console.log(formvalue.isValid);
    this.isDemographicFormValid = formvalue.isValid;
  }

  onUpdateAccessControlForm(formvalue: FormValue): void {
    this.formData = { ...this.formData, ...formvalue.getValues() };
    console.log(formvalue.isValid);
    this.isAccessControlFormValid = formvalue.isValid;
  }

  onOrgUnitUpdate(selection: any, type: string): void {
    if (type === 'ENTRY') {
      this.formData['entry'] = {
        id: 'ENTRY',
        value: selection?.items,
      };
    } else {
      this.formData['report'] = {
        id: 'REPORT',
        value: selection?.items,
      };
    }
  }

  onNext(event: Event): void {
    event.stopPropagation();
    // Ensure the first ones have been taken and stored on localstorage
    // Do not clear access control (only clear demographic)

    // Check if you are editing existing item
    this.formDataToStoreLocally = !this.currentUserToCreateSelected
      ? [
          ...this.formDataToStoreLocally,
          {
            id: 'REF' + Date.now(),
            firstName: this.formData?.firstName?.value,
            middleName: this.formData?.middleName?.value,
            lastName: this.formData?.lastName?.value,
            phoneNumber: this.formData?.phoneNumber?.value,
            email: this.formData?.email?.value,
            title: this.formData?.title?.value,
            titleDescription: this.formData?.titleDescription?.value,
            entryOrgUnits: this.formData?.entry?.value,
            reportOrgUnits: this.formData?.report?.value,
            userGroups: [
              {
                id: this.formData?.userGroup?.value,
              },
            ],
            userRoles: [
              {
                id: this.formData?.userRole?.value,
              },
            ],
          },
        ]
      : this.formDataToStoreLocally?.map((data) => {
          if (data?.id === this.currentUserToCreateSelected) {
            return {
              id: this.currentUserToCreateSelected,
              firstName: this.formData?.firstName?.value,
              middleName: this.formData?.middleName?.value,
              lastName: this.formData?.lastName?.value,
              phoneNumber: this.formData?.phoneNumber?.value,
              email: this.formData?.email?.value,
              title: this.formData?.title?.value,
              titleDescription: this.formData?.titleDescription?.value,
              entryOrgUnits: this.formData?.entry?.value,
              reportOrgUnits: this.formData?.report?.value,
              userGroups: [
                {
                  id: this.formData?.userGroup?.value,
                },
              ],
              userRoles: [
                {
                  id: this.formData?.userRole?.value,
                },
              ],
            };
          } else {
            return data;
          }
        });

    this.currentUserToCreateSelected = null;
    localStorage.setItem(
      'usersToCreate',
      JSON.stringify(this.formDataToStoreLocally)
    );
    this.createDemographicFields();
  }

  onFinish(event: Event): void {
    event.stopPropagation();
    this.readyToSave = true;
  }

  onClear(event: Event): void {
    event.stopPropagation();

    this.createDemographicFields();
    this.createAccessControlFields();
  }

  onSave(event: Event, confirmed?: boolean): void {
    event.stopPropagation();
    if (confirmed) {
      this.saving = true;
      this.shouldConfirm = false;
      this.readyToSave = false;
      // Clear local storage
      // Send data to datastore and messaging after confirm
      const dataStructure = {
        id: 'UA' + Date.now().toString(),
        ticketNumber: 'UA' + Date.now().toString(),
        action: 'Should contain action message',
        message: {
          message: 'message to DHIS2 messaging',
          subject: 'UA' + Date.now().toString() + '- MAOMBI YA ACCOUNT',
        },
        replyMessage: '',
        payload: {},
        url: '',
        method: 'POST',
        user: this.currentUser,
      };
    } else {
      this.shouldConfirm = true;
    }
  }
}
