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

  isDemographicFormValid: boolean = false;
  isAccessControlFormValid: boolean = false;

  orgUnitFilterConfig: any = {
    singleSelection: true,
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
  selectedOrgUnitItems: any[] = [];

  shouldConfirm: boolean = false;
  saving: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.createDemographicFields();
    this.createAccessControlFields();
  }

  createDemographicFields(data?: any): void {
    this.formFields = [
      new Textbox({
        id: 'firstname',
        key: 'firstname',
        label: 'Firstname',
        required: true,
        options: [],
      }),
      new Textbox({
        id: 'middlename',
        key: 'middlename',
        label: 'Middlename',
        required: false,
        options: [],
      }),
      new Textbox({
        id: 'lastname',
        key: 'lastname',
        label: 'Lastname',
        required: true,
        options: [],
      }),
      new Email({
        id: 'email',
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
      }),
      new Textbox({
        id: 'phonenumber',
        key: 'phonenumber',
        label: 'Phone number',
        type: 'phonenumber',
        required: true,
      }),
      new Dropdown({
        id: 'title',
        key: 'title',
        label: 'Title',
        required: true,
        options: [],
      }),
      new TextArea({
        id: 'titleDescription',
        key: 'titleDescription',
        label: 'Title description',
        options: [],
      }),
    ];
  }

  createAccessControlFields(data?: any): void {
    this.accessFormFields = [
      new Dropdown({
        id: 'role',
        key: 'role',
        label: 'Role',
        required: true,
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
    console.log(formvalue.getValues());
    this.isDemographicFormValid = formvalue.isValid;
  }

  onUpdateAccessControlForm(formvalue: FormValue): void {
    console.log(formvalue.getValues());
    this.isAccessControlFormValid = formvalue.isValid;
  }

  onOrgUnitUpdate(selection: any, action: string): void {
    console.log(action);
    console.log(selection);
  }

  onNext(event: Event): void {
    event.stopPropagation();
    // Ensure the first ones have been taken and stored on localstorage
    // Do not clear access control (only clear demographic)
    this.createDemographicFields();
  }

  onCancel(event: Event): void {
    event.stopPropagation();

    this.createDemographicFields();
    this.createAccessControlFields();
  }

  onSave(event: Event, confirmed?: boolean): void {
    event.stopPropagation();
    if (confirmed) {
      this.saving = true;
      this.shouldConfirm = false;
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
