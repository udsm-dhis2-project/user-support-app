import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersDataService } from 'src/app/core/services/users.service';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

@Component({
  selector: 'app-username-form-field',
  templateUrl: './username-form-field.component.html',
  styleUrls: ['./username-form-field.component.css'],
})
export class UsernameFormFieldComponent implements OnInit {
  @Input() user: any;
  @Input() count: number;
  usernameField: any;
  @Output() usernameData: EventEmitter<any> = new EventEmitter<any>();
  @Output() usernameValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() validityCheckMessage: EventEmitter<string> =
    new EventEmitter<string>();
  key: string;
  potentialUsernames: any[];
  proposedUsername: string;
  usernameExist: boolean = false;
  hasEmptySpace: boolean = false;
  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {
    this.createUsernameField();
    this.potentialUsernames = [1, 2, 3].map((key) => {
      return {
        key,
        username: (
          this.user?.firstName.trim().substring(0, key) +
          this.user?.surname.trim()
        )
          .toLowerCase()
          .trim(),
      };
    })
      .filter((item) => item.username.length >= 5);

    this.usersDataService
      .checkForUserNamesAvailability(this.potentialUsernames)
      .subscribe((response) => {
        if (response) {
          this.proposedUsername = (response?.filter((data) => data?.username) ||
            [])[0]?.username;
        }
      });
  }

  createUsernameField(): void {
    this.key = 'username' + this.count;
    this.usernameField = new Textbox({
      id: 'username' + this.count,
      key: 'username' + this.count,
      label: 'Username',
      type: 'text',
      category: 'username',
      required: true,
      options: [],
    });
  }

  onFormUpdate(formValue: FormValue): void {
    const username = formValue.getValues()[this.key]?.value;
    this.hasEmptySpace = username?.indexOf(' ') > -1;
    if (this.hasEmptySpace) {
      this.usernameValid.emit(false);
      this.validityCheckMessage.emit('Username should not have empty space');
    } else if (!this.hasEmptySpace && username?.length < 5) {
      this.usernameValid.emit(false);
      this.validityCheckMessage.emit(
        'Username should not have less than 5 characters'
      );
    } else {
      this.usersDataService.verifyUsername(username).subscribe((response) => {
        if (response?.length > 0) {
          this.usernameExist = true;
          this.usernameValid.emit(false);
          this.validityCheckMessage.emit('Username ' + username + ' exists');
          this.usernameData.emit(username);
        } else if (response?.length === 0) {
          this.usernameExist = false;
          this.usernameValid.emit(true);
          this.validityCheckMessage.emit(null);
          this.usernameData.emit(username);
        } else {
          this.usernameValid.emit(false);
        }
      });
    }
  }
}
