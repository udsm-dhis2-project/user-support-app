import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { ValidationRulesService } from 'src/app/core/services/validation-rules.service';

@Component({
  selector: 'app-save-validation-modal',
  templateUrl: './save-validation-modal.component.html',
  styleUrls: ['./save-validation-modal.component.css'],
})
export class SaveValidationModalComponent implements OnInit {
  public data;
  validationRule: any;
  created: boolean = false;
  creating: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SaveValidationModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private validationRuleService: ValidationRulesService,
    private dataStoreService: DataStoreDataService
  ) {
    this.data = data;
  }

  ngOnInit(): void {
    this.validationRule = {
      id: this.data?.id,
      name: this.data?.name,
      shortName: this.data?.shortName,
      description: this.data?.description,
      importance: this.data?.importance,
      instrunctions: this.data?.instructions,
      publicAccess: 'rw------',
      operator: this.data?.operator,
      periodType: this.data?.periodType,
      skipFormValidation: false,
      leftSide: {
        expression: this.data?.leftSide?.expression,
        description: this.data?.leftSide?.description,
        missingValueStrategy: 'NEVER_SKIP',
        slidingWindow: false,
      },
      rightSide: {
        expression: this.data?.rightSide?.expression,
        description: this.data?.rightSide?.description,
        missingValueStrategy: 'NEVER_SKIP',
        slidingWindow: false,
      },
    };
  }

  onSave(event: Event, validationRule): void {
    event.stopPropagation();
    this.creating = true;
    const key = 'VALIDATION_RULE_test_' + Date.now();
    const ruleRequest = {
      validationRule,
      id: key,
      type: 'VALIDATION_RULE_REQUEST',
    };
    this.dataStoreService
      .createValidationRuleRequest(key, ruleRequest)
      .subscribe((response) => {
        if (response) {
          this.created = true;
          this.creating = false;
        }
      });
  }
}
