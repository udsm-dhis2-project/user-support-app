import { Component, Input, OnInit } from '@angular/core';
import { UsersDataService } from 'src/app/core/services/users.service';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Email } from 'src/app/shared/modules/form/models/email.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { TextArea } from 'src/app/shared/modules/form/models/text-area.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  @Input() configurations: any;
  formFields: Field<string>[];
  accessFormFields: Field<string>[];

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
  constructor(private userDataService: UsersDataService) {}

  ngOnInit(): void {
    this.formFields = [
      // new Textbox({
      //   id: 'username',
      //   key: 'username',
      //   label: 'Username',
      //   type: 'text',
      //   category: 'username',
      //   required: true,
      //   options: [],
      // }),
      // new Textbox({
      //   id: 'password',
      //   key: 'password',
      //   label: 'Password',
      //   required: true,
      //   options: [],
      // }),
      // new Textbox({
      //   id: 'repeatpassword',
      //   key: 'repeatpassword',
      //   label: 'Repeat password',
      //   type: 'password',
      //   required: true,
      //   options: [],
      // }),
      new Textbox({
        id: 'firstname',
        key: 'firstname',
        label: 'Firstname',
        type: 'text',
        required: true,
        options: [],
      }),
      new Textbox({
        id: 'lastname',
        key: 'lastname',
        label: 'Lastname',
        type: 'text',
        required: true,
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

    this.accessFormFields = [
      new Dropdown({
        id: 'role',
        key: 'role',
        label: 'Role',
        required: true,
        options: [],
      }),
      new Dropdown({
        id: 'userGroup',
        key: 'userGroup',
        label: 'Groups',
        required: true,
        options: [],
      }),
    ];
  }

  onUpdateForm(formvalue: FormValue): void {
    console.log(formvalue.getValues());
  }

  onOrgUnitUpdate(selection: any, action: string): void {
    console.log(action);
    console.log(selection);
  }
}
