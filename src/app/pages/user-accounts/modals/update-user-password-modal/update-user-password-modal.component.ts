import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-password-modal',
  templateUrl: './update-user-password-modal.component.html',
  styleUrls: ['./update-user-password-modal.component.css'],
})
export class UpdateUserPasswordModalComponent implements OnInit {
  passwordsMatch: boolean = false;
  errorMessage: string = '';
  changePassword: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  hide = true;
  hideRepeat = true;
  password: string;
  constructor(
    private matDialogRef: MatDialogRef<UpdateUserPasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  get passwordInput() {
    const pwd = this.changePassword.get('password')?.value;
    const repeatPwd = this.changePassword.get('repeatPassword')?.value;
    // console.log(pwd)
    const isPassWordCorrect = this.validatePassword(pwd);
    if (pwd.length >= 8 && !isPassWordCorrect) {
      this.errorMessage =
        'At least one number, one small letter, one capital later and one special character required';
    } else if (pwd.length > 4 && pwd.length < 8) {
      this.errorMessage = 'At least 8 characters required';
    } else {
      this.errorMessage = '';
    }
    this.passwordsMatch = pwd == repeatPwd ? true : false;
    this.password = pwd;
    return this.changePassword.get('password');
  }

  get passwordRepeatInput() {
    const pwd = this.changePassword.get('password')?.value;
    const repeatPwd = this.changePassword.get('repeatPassword')?.value;
    // console.log(pwd)
    const isPassWordCorrect = this.validatePassword(repeatPwd);
    if (pwd.length >= 8 && !isPassWordCorrect) {
      this.errorMessage =
        'At least one number, one small letter, one capital later and one special character required';
    } else {
      this.errorMessage = '';
    }
    this.passwordsMatch = pwd == repeatPwd ? true : false;
    this.password = pwd;
    return this.changePassword.get('repeatPassword');
  }

  validatePassword(inputtxt) {
    var check =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (inputtxt.match(check)) {
      return true;
    } else {
      return false;
    }
  }

  confirmPasswordChange(event: Event): void {
    event.stopPropagation();
    this.matDialogRef.close(this.password);
  }
}
