// new-language-dialog/new-language-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {keyBy} from "lodash";

@Component({
  selector: 'app-new-language-dialog',
  templateUrl: './new-language-dialog.component.html',
  styleUrls: ['./new-language-dialog.component.css'],
})
export class NewLanguageDialogComponent {
  name: string;
  key: string;
  keyedKeyWords: { [key: string]: {name: string, key: string} } = {};

  constructor(public dialogRef: MatDialogRef<NewLanguageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data && data.keyedKeyWords) {
      this.keyedKeyWords = keyBy(data?.keyedKeyWords, 'key') || {};
    }
    console.log(this.keyedKeyWords);
  }

  onSubmit(): void {
    if (this.name && this.key) {

      this.dialogRef.close({ name: this.name, key: this.key });
    } else {
      // Optionally, you can display a message or take another action to inform the user.
      console.log('Fields are required');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
