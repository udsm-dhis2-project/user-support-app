import { Text } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { UsersDataService } from 'src/app/core/services/users.service';
import { Email } from 'src/app/shared/modules/form/models/email.model';
import { Field } from 'src/app/shared/modules/form/models/field.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  formFields: Field<string>[];
  constructor(private userDataService: UsersDataService) {}

  ngOnInit(): void {
    this.formFields = [
      new Textbox({
        id: 'username',
        key: 'username',
        label: 'Username',
        type: 'text',
        category: 'username',
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
        type: 'password',
        required: true,
        options: [],
      }),
      new Textbox({
        id: 'firstname',
        key: 'firstname',
        label: 'Firstname',
        type: 'text',
        required: true,
        options: [],
      }),
      new Textbox({
        id: 'middlename',
        key: 'middlename',
        label: 'Middlename',
        type: 'text',
        required: false,
        options: [],
      }),
      new Textbox({
        id: 'lastname',
        key: 'lastname',
        label: 'Lastname',
        type: 'text',
        required: true,
        options: [],
      }),
      new Email({
        id: 'email',
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        options: [],
      }),
      new Textbox({
        id: 'phonenumber',
        key: 'phonenumber',
        label: 'Phone number',
        type: 'phonenumber',
        required: true,
        options: [],
      }),
    ];
  }

  onUpdateForm(formvalue: FormValue): void {
    console.log(formvalue.getValues());
  }
}
