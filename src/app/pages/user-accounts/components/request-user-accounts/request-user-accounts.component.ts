import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Email } from 'src/app/shared/modules/form/models/email.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { TextArea } from 'src/app/shared/modules/form/models/text-area.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';
import { removeDuplicates } from '../../../../shared/helpers/util.helper';

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
  prevIndex: number = 0;
  showOrgUnit: boolean = true;

  constructor(
    private dataStoreService: DataStoreDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUsersData = localStorage.getItem('usersToCreate');
    if (storedUsersData) {
      this.formDataToStoreLocally = JSON.parse(storedUsersData);
      console.log('formDataToStoreLocally', this.formDataToStoreLocally);
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

    if (this.formDataToStoreLocally?.length) {
      this.prevIndex = this.formDataToStoreLocally?.length - 1;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onPrev(event: Event): void {
    event.stopPropagation();
    if (this.prevIndex > 0) {
      this.prevIndex = this.prevIndex - 1;
      this.createDemographicFields(
        this.formDataToStoreLocally?.length > 0
          ? this.formDataToStoreLocally[this.prevIndex]
          : null
      );
      this.createAccessControlFields(
        this.formDataToStoreLocally?.length > 0
          ? this.formDataToStoreLocally[this.prevIndex]
          : null
      );
    }
  }

  onNext(event: Event): void {
    event.stopPropagation();
    // Ensure the first ones have been taken and stored on localstorage
    // Do not clear access control (only clear demographic)

    // Check if you are editing existing item
    this.showOrgUnit = false;
    this.pageReady = false;
    this.formDataToStoreLocally = !this.formUpdateIsDone
      ? this.formDataToStoreLocally
      : !this.currentUserToCreateSelected
      ? [
          ...this.formDataToStoreLocally,
          {
            id: 'REF' + Date.now(),
            firstName: this.formData?.firstName?.value.trim(),
            lastName: this.formData?.lastName?.value.trim(),
            phoneNumber: this.formData?.phoneNumber?.value,
            email: this.formData?.email?.value.trim(),
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
              firstName: this.formData?.firstName?.value.trim(),
              lastName: this.formData?.lastName?.value.trim(),
              phoneNumber: this.formData?.phoneNumber?.value,
              email: this.formData?.email?.value.trim(),
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
    if (this.formDataToStoreLocally?.length) {
      this.prevIndex = this.formDataToStoreLocally?.length - 1;
    }
    this.createDemographicFields();

    this.selectedOrgUnitItemsForDataEntry = [];
    this.selectedOrgUnitItemsForReport = [];
    setTimeout(() => {
      this.showOrgUnit = true;
    }, 100);
  }

  onFinish(event: Event): void {
    event.stopPropagation();
    // testing logic
    this.formDataToStoreLocally = !this.formUpdateIsDone
      ? this.formDataToStoreLocally
      : !this.currentUserToCreateSelected
      ? [
          ...this.formDataToStoreLocally,
          {
            id: 'REF' + Date.now(),
            firstName: this.formData?.firstName?.value.trim(),
            lastName: this.formData?.lastName?.value.trim(),
            phoneNumber: this.formData?.phoneNumber?.value.trim(),
            email: this.formData?.email?.value.trim(),
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
              firstName: this.formData?.firstName?.value.trim(),
              lastName: this.formData?.lastName?.value.trim(),
              phoneNumber: this.formData?.phoneNumber?.value.trim(),
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
    this.formDataToStoreLocally = removeDuplicates(
      this.formDataToStoreLocally,
      'phoneNumber'
    );
    this.currentUserToCreateSelected = null;
    localStorage.setItem(
      'usersToCreate',
      JSON.stringify(this.formDataToStoreLocally)
    );
    this.createDemographicFields();
    // testing logic
    // jdksdjsk;

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
      const dataStoreKey =
        'UA' + Date.now() + '_' + this.currentUser?.organisationUnits[0]?.id;
      // Check potentialUserNames first
      const dataForMessageAndDataStore = {
        id: dataStoreKey,
        ticketNumber: 'UA' + Date.now().toString(),
        action: `Respond to creation of ${this.formDataToStoreLocally?.length} accounts as requested by ${this.currentUser?.displayName}`,
        message: {
          message: `The following accounts were requested accordingly: \n\n ${this.formDataToStoreLocally
            ?.map((data, index) => {
              return (
                (index + 1).toString() +
                '. ' +
                'Names: <b>' +
                data?.firstName +
                ' ' +
                data?.lastName +
                ' </b>' +
                ' Email: ' +
                (data?.email ? data?.email : ' - ') +
                ' Phone number :' +
                data?.phoneNumber +
                ' Entry access level ->  <b>' +
                data?.entryOrgUnits?.map((ou) => ou?.name).join(', ') +
                '</b>' +
                ' and Report access level -> <b>' +
                data?.reportOrgUnits?.map((ou) => ou?.name).join(', ') +
                '</b>'
              );
            })
            .join('\n')} `,
          subject: 'UA' + Date.now().toString() + '- MAOMBI YA ACCOUNT',
        },
        replyMessage: 'to be constructed',
        payload: this.formDataToStoreLocally?.map((data, index) => {
          return {
            userCredentials: {
              cogsDimensionConstraints: [],
              catDimensionConstraints: [],
              username: '',
              password: this.configurations?.usersSettings?.defaultPassword,
              userRoles: data?.userRoles,
            },
            surname: data?.lastName.trim(),
            firstName: data?.firstName.trim(),
            email: data?.email.trim(),
            phoneNumber: data?.phoneNumber.trim(),
            organisationUnits: data?.entryOrgUnits,
            dataViewOrganisationUnits: data?.reportOrgUnits,
            userGroups: data?.userGroups,
            attributeValues: [],
            referenceId: data?.phoneNumber.toString() + (index + 1),
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
            this.router.navigate(['/user-accounts/list']);
          }, 2000);
        });
    } else {
      this.shouldConfirm = true;
    }
  }

  backtoRequest(event: Event): void {
    event.stopPropagation();
    this.readyToSave = false;
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
      // new Textbox({
      //   id: 'middleName',
      //   key: 'middleName',
      //   label: 'Middlename',
      //   value: data ? data?.middleName : null,
      //   required: false,
      //   options: [],
      // }),
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
      // new Dropdown({
      //   id: 'title',
      //   key: 'title',
      //   label: 'Title',
      //   required: false,
      //   value: data ? data?.title : null,
      //   options: this.configurations?.referenceTitles?.map((title) => {
      //     return {
      //       id: title?.id,
      //       key: title?.id,
      //       label: title?.name,
      //       name: title?.name,
      //     };
      //   }),
      // }),
    ];
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
        id: this.formData?.userRole?.value,
      },
    ];

    this.selectedUserGroups = [
      {
        id: this.formData?.userGroup?.value,
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
