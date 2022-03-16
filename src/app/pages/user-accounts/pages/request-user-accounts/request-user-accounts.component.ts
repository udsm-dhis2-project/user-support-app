import { Component, OnInit } from '@angular/core';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

@Component({
  selector: 'app-request-user-accounts',
  templateUrl: './request-user-accounts.component.html',
  styleUrls: ['./request-user-accounts.component.css'],
})
export class RequestUserAccountsComponent implements OnInit {
  formFields: Field<string>[];
  constructor() {}

  ngOnInit(): void {
    this.formFields = [
      new Textbox({
        id: 'username',
        key: 'username',
        label: 'Username',
        required: true,
        options: [],
      }),
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
      new Textbox({
        id: 'password',
        key: 'password',
        label: 'Password',
        required: true,
        options: [],
      }),
      new Textbox({
        id: 'repeatpassword',
        key: 'repeatpassword',
        label: 'Repeat password',
        required: true,
        options: [],
      }),
    ];
  }

  onUpdateForm(formvalue: FormValue): void {
    // console.log(formvalue.getValues());
  }
}
