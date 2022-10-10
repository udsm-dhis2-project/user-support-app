import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
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
  @Input() systemConfigs: any;
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

  selectedRoles: any[] = [];
  selectedUserGroups: any[] = [];

  shouldConfirm: boolean = false;
  saving: boolean = false;

  currentUserToCreateSelected: string;
  readyToSave: boolean = false;
  pageReady: boolean = false;
  formUpdateIsDone: boolean = false;

  constructor(
    private dataStoreService: DataStoreDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar
  ) {}

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
      this.selectedRoles =
        this.formDataToStoreLocally[
          this.formDataToStoreLocally?.length - 1
        ]?.userRoles;

      this.selectedUserGroups =
        this.formDataToStoreLocally[
          this.formDataToStoreLocally?.length - 1
        ]?.userGroups;

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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onNext(event: Event): void {
    event.stopPropagation();
    // Ensure the first ones have been taken and stored on localstorage
    // Do not clear access control (only clear demographic)

    // Check if you are editing existing item
    this.pageReady = false;
    this.formDataToStoreLocally = !this.formUpdateIsDone
      ? this.formDataToStoreLocally
      : !this.currentUserToCreateSelected
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
            entryOrgUnits: this.selectedOrgUnitItemsForDataEntry,
            reportOrgUnits: this.selectedOrgUnitItemsForReport,
            userGroups: this.selectedUserGroups,
            userRoles: this.selectedRoles,
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
    console.log(this.formData);
    console.log(this.formDataToStoreLocally);
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
      const dataStoreKey = 'UA' + Date.now();
      const dataForMessageAndDataStore = {
        id: dataStoreKey,
        ticketNumber: 'UA' + Date.now().toString(),
        action: `Respond to creation of ${this.formDataToStoreLocally?.length} accounts as requested by ${this.currentUser?.display}`,
        message: {
          message: `The following accounts are requested accordingly: \n\n ${this.formDataToStoreLocally?.map(
            (data) => {
              return (
                'Names: <b>' +
                data?.firstName +
                ' ' +
                data?.middleName +
                ' ' +
                data?.lastName +
                ' </b>' +
                ' Email: ' +
                data?.email +
                ' Phone number :' +
                data?.phoneNumber +
                ' Access level: Entry side -> ' +
                data?.entryOrgUnits?.map((ou) => ou?.name).join(', ') +
                ' and Report side ->' +
                data?.reportOrgUnits?.map((ou) => ou?.name).join(', ')
              );
            }
          )} `,
          subject: 'UA' + Date.now().toString() + '- MAOMBI YA ACCOUNT',
        },
        replyMessage: 'to be constructed',
        payload: this.formDataToStoreLocally?.map((data) => {
          return {
            userCredentials: {
              cogsDimensionConstraints: [],
              catDimensionConstraints: [],
              username: '',
              password: '',
              userRoles: data?.userRoles,
            },
            surname: data?.middleName + ' ' + data?.lastName,
            firstName: data?.firstName,
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            organisationUnits: data?.entryOrgUnits,
            dataViewOrganisationUnits: data?.reportOrgUnits,
            userGroups: data?.userGroups,
            attributeValues: [],
          };
        }),
        url: 'users',
        method: 'POST',
        user: this.currentUser,
      };

      const messageData = {
        subject: dataForMessageAndDataStore?.message?.subject,
        messageType: 'TICKET',
        users: [],
        userGroups: [{ id: this.systemConfigs?.feedbackRecipients?.id }],
        organisationUnits: [],
        attachments: [],
        text: dataForMessageAndDataStore?.message?.message,
      };

      console.log('messageData', messageData);

      this.messageAndDataStoreService
        .createMessageAndUpdateDataStore(messageData, {
          id: dataStoreKey,
          user: {
            id: this.currentUser?.id,
            displayName: this.currentUser?.displayName,
            userName: this.currentUser?.userCredentials?.username,
            jobTitle: this.currentUser?.jobTitle,
            email: this.currentUser?.email,
            organisationUnits: this.currentUser?.organisationUnits,
            phoneNumber: this.currentUser?.phoneNumber,
          },
          message: dataForMessageAndDataStore?.message,
          ...dataForMessageAndDataStore,
        })
        .subscribe((response) => {
          window.localStorage.removeItem('usersToCreate');
          this.saving = false;
          this.openSnackBar('Successfully sent form request', 'Close');
          setTimeout(() => {
            this._snackBar.dismiss();
          }, 2000);
        });
    } else {
      this.shouldConfirm = true;
    }
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

    console.log(this.formFields);
    this.pageReady = true;
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
    this.pageReady = true;
    console.log(this.accessFormFields);
  }

  onUpdateDemographicForm(formvalue: FormValue): void {
    this.formData = { ...this.formData, ...formvalue.getValues() };
    this.formUpdateIsDone = true;
    this.isDemographicFormValid = formvalue.isValid;
  }

  onUpdateAccessControlForm(formvalue: FormValue): void {
    this.formData = { ...this.formData, ...formvalue.getValues() };
    this.formUpdateIsDone = true;
    this.selectedRoles = [
      {
        id: this.formData?.userRole?.id,
      },
    ];

    this.selectedUserGroups = [
      {
        id: this.formData?.userGroup?.id,
      },
    ];
    this.isAccessControlFormValid = formvalue.isValid;
  }

  onOrgUnitUpdate(selection: any, type: string): void {
    if (type === 'ENTRY') {
      this.selectedOrgUnitItemsForDataEntry = selection?.items;
      this.formData['entry'] = {
        id: 'ENTRY',
        value: this.selectedOrgUnitItemsForDataEntry,
      };
    } else {
      this.selectedOrgUnitItemsForReport = selection?.items;
      this.formData['report'] = {
        id: 'REPORT',
        value: this.selectedOrgUnitItemsForReport,
      };
    }
  }
}
