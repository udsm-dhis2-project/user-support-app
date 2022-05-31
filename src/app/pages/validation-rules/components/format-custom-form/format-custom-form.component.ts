import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { SaveValidationModalComponent } from '../save-validation-modal/save-validation-modal.component';
import { MetadataDescriptionService } from 'src/app/core/services/metadata-description.service';
import { Observable } from 'rxjs';
import { ValidationRulesService } from 'src/app/core/services/validation-rules.service';
import { DataelementsService } from 'src/app/core/services/dataelements.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DataSetsService } from 'src/app/core/services/dataset.service';

@Component({
  selector: 'app-format-custom-form',
  templateUrl: './format-custom-form.component.html',
  styleUrls: ['./format-custom-form.component.css'],
})
export class FormatCustomFormComponent implements OnInit {
  dataSets$: Observable<any[]>;
  validationRuleId: string;
  searchString: string = '';
  _htmlMarkup: SafeHtml;
  dataSetCtrl: FormControl = new FormControl('');
  dataset: any;
  importanceOptions = [
    {
      id: 'HIGH',
      name: 'High',
    },
    {
      id: 'MEDIUM',
      name: 'Medium',
    },
    {
      id: 'LOW',
      name: 'Low',
    },
  ];

  periodTypes = [
    {
      id: 'Monthly',
      name: 'Monthly',
    },
    {
      id: 'Quarterly',
      name: 'Quarterly',
    },
  ];

  operators = [
    {
      id: 'equal_to',
      name: 'Equal to',
    },
    {
      id: 'not_equal_to',
      name: 'Not Equal to',
    },
    {
      id: 'less_than',
      name: 'Less than',
    },
    {
      id: 'greater_than_or_equal_to',
      name: 'Greater than or equal to',
    },
  ];
  name: string;
  shortName: string;
  description: string;
  instruction: string;
  importance: any;
  periodType: any;
  leftSideDescription: string;
  leftSideExpression: string;
  operator: any;
  rightSideDescription: string;
  rightSideExpression: string;
  shouldSkipValidation: boolean;
  isRightSideSet: boolean = false;
  isLeftSideSet: boolean = false;
  currentExpression: string = '';
  metadataIds: string[] = [];
  leftSideMetadataIds: string[] = [];
  RightSideMetadataIds: string[] = [];
  uids: string[] = [];
  expressionDescriptionRight$: Observable<any>;
  expressionDescriptionLeft$: Observable<any>;
  curretOperatorId: string;
  selectedTab = new FormControl(0);

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private metadataExpressionDescriptionService: MetadataDescriptionService,
    private validationRuleService: ValidationRulesService,
    private dataElementService: DataelementsService,
    private dataSetsService: DataSetsService
  ) {}

  ngOnInit(): void {
    this.dataSets$ = this.dataSetsService.getDataSets('');
  }

  getExpressionDefinition(event, expressionPart): void {
    const expression = event.target.value;
    if (expressionPart === 'LEFT') {
      this.isRightSideSet = false;
      this.isLeftSideSet = true;
    } else {
      this.isRightSideSet = true;
      this.isLeftSideSet = false;
    }

    let self = this;

    if (self.isLeftSideSet) {
      self.leftSideExpression = expression;
      self.expressionDescriptionLeft$ =
        self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
          expression
        );
    } else {
      self.rightSideExpression = expression;
      self.expressionDescriptionRight$ =
        self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
          expression
        );
    }
  }

  searchItem(event: any): void {
    const searchingText = event.target.value;
    if (searchingText && searchingText.length >= 3) {
      this.dataSets$ = this.dataSetsService.getDataSets(searchingText);
    } else {
      this.dataSets$ = this.dataSetsService.getDataSets('');
    }
  }

  getSelectedItemFromOption(event: MatAutocompleteSelectedEvent): void {
    this.dataset = event.option.value;

    let ids = [];
    let self = this;
    try {
      this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(
        this.dataset?.dataEntryForm?.htmlCode
      );

      document.addEventListener(
        'click',
        function (event: any) {
          if (event.target.name == 'entryfield') {
            document.getElementById(event.target.id).style.backgroundColor =
              self.isLeftSideSet
                ? '#36e1f2'
                : self.isRightSideSet
                ? '#3667f2'
                : '';

            if (self.isLeftSideSet) {
              self.leftSideExpression =
                (self.leftSideExpression ? self.leftSideExpression : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionLeft$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.leftSideExpression
                );
            } else if (self.isRightSideSet) {
              self.rightSideExpression =
                (self.rightSideExpression ? self.rightSideExpression : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionRight$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.rightSideExpression
                );
            } else {
              // No side selected
              self.leftSideExpression = '';
              self.rightSideExpression = '';
            }
          } else {
          }
          event.preventDefault();
        },
        false
      );
    } catch (e) {
      console.log('ng on init ' + JSON.stringify(e));
    }
  }

  displayFunction(selectedOprion: any): string {
    return selectedOprion?.name;
  }

  onSelectionChange(item): void {
    // let expression = '<input disabled="disabled" id="aI75w49azlp" indicatorformula="(#{o0KObJuu9Yu.o9Oj5Cjekej}+#{o0KObJuu9Yu.ZU3sKDB9i2o})/(1)" name="indicatorFormula" readonly="readonly" style="width:3.5em;text-align:center/" />';
    let ids = [];
    let self = this;
    try {
      this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(
        item?.dataEntryForm?.htmlCode
      );

      document.addEventListener(
        'click',
        function (event: any) {
          if (event.target.name == 'entryfield') {
            document.getElementById(event.target.id).style.backgroundColor =
              self.isLeftSideSet
                ? '#36e1f2'
                : self.isRightSideSet
                ? '#3667f2'
                : '';

            if (self.isLeftSideSet) {
              self.leftSideExpression =
                (self.leftSideExpression ? self.leftSideExpression : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionLeft$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.leftSideExpression
                );
            } else if (self.isRightSideSet) {
              self.rightSideExpression =
                (self.rightSideExpression ? self.rightSideExpression : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionRight$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.rightSideExpression
                );
            } else {
              // No side selected
              self.leftSideExpression = '';
              self.rightSideExpression = '';
            }
          } else {
          }
          event.preventDefault();
        },
        false
      );
    } catch (e) {
      console.log('ng on init ' + JSON.stringify(e));
    }
  }

  getSignValue(event: Event, operator, expressionPart, expression) {
    event.stopPropagation();
    if (expressionPart == 'LEFT') {
      this.leftSideExpression = expression + ' ' + operator + ' ';
    } else {
      this.rightSideExpression = expression + ' ' + operator + ' ';
    }
    this.curretOperatorId = operator;
  }

  setActiveExpressionArea(event: Event, expressionPart): void {
    event.stopPropagation();
    if (expressionPart === 'LEFT') {
      this.isRightSideSet = false;
      this.isLeftSideSet = true;
    } else {
      this.isRightSideSet = true;
      this.isLeftSideSet = false;
    }
  }

  onClear(event: Event): void {
    event.stopPropagation();
    this.validationRuleId = null;
    this.name = '';
    this.shortName = '';
    this.description = '';
    this.leftSideExpression = '';
    this.leftSideDescription = '';

    this.rightSideExpression = '';
    this.rightSideDescription = '';
    this.operator = null;
    this.importance = null;
    this.periodType = null;
  }

  onRequestValidationRule(event: Event): void {
    event.stopPropagation();
    const data = {
      id: this.validationRuleId,
      name: this.name,
      shortName: this.shortName,
      importance: this.importance['id'],
      periodType: this.periodType['id'],
      instructions: this.instruction,
      description: this.description,
      operator: this.operator['id'],
      leftSide: {
        expression: this.leftSideExpression,
        description: this.leftSideDescription,
      },
      rightSide: {
        expression: this.rightSideExpression,
        description: this.leftSideDescription,
      },
    };
    this.dialog.open(SaveValidationModalComponent, {
      width: '40%',
      data,
    });
  }

  changeTab(index) {
    this.selectedTab.setValue(index);
  }

  onEditValidationRule(rule): void {
    this.selectedTab.setValue(0);
    this.validationRuleId = rule?.id;
    document.getElementsByName('entryfield').forEach((elem, index) => {
      elem.style.backgroundColor = '#FFF';
    });
    this.validationRuleService
      .getValidationRuleDetails(rule)
      .subscribe((response) => {
        if (response) {
          this.name = response?.name;
          this.shortName = response?.shortName;
          this.description = response?.description;
          this.leftSideExpression = response?.leftSide?.expression;
          this.leftSideDescription = response?.leftSide?.description;

          this.rightSideExpression = response?.rightSide?.expression;
          this.rightSideDescription = response?.rightSide?.description;
          this.operator = (this.operators.filter(
            (operator) => operator?.id === response?.operator
          ) || [])[0];
          this.importance = (this.importanceOptions.filter(
            (option) => option?.id === response?.importance
          ) || [])[0];
          this.periodType = (this.periodTypes.filter(
            (periodType) => periodType?.id === response?.periodType
          ) || [])[0];

          // Get definition
          this.expressionDescriptionRight$ =
            this.metadataExpressionDescriptionService.getMetadataExpressionDescription(
              this.rightSideExpression
            );
          this.expressionDescriptionLeft$ =
            this.metadataExpressionDescriptionService.getMetadataExpressionDescription(
              this.leftSideExpression
            );
        }

        this.setColorsToElementsInExpressions(
          this.leftSideExpression,
          this.rightSideExpression
        );
      });
  }

  setColorsToElementsInExpressions(
    leftSideExpression,
    rightSideExpression
  ): void {
    const formulaPattern = /#\{.+?\}/g;
    leftSideExpression.match(formulaPattern).forEach((elem) => {
      const formElementToSetColor = elem.replace(/[#\{\}]/g, '');
      if (formElementToSetColor.length < 14) {
        this.dataElementService
          .getDataElement(formElementToSetColor)
          .subscribe((elemResponse) => {
            if (elemResponse) {
              elemResponse?.id +
                '-' +
                elemResponse?.categoryCombo?.categoryOptionCombos.forEach(
                  (option) => {
                    try {
                      document.getElementById(
                        option?.id + '-val'
                      ).style.backgroundColor = '#36e1f2';
                    } catch (e) {}
                  }
                );
            }
          });
      } else {
        try {
          document.getElementById(
            formElementToSetColor.split('.').join('-') + '-val'
          ).style.backgroundColor = '#36e1f2';
        } catch (e) {}
      }
    });

    rightSideExpression.match(formulaPattern).forEach((elem) => {
      const formElementToSetColor = elem.replace(/[#\{\}]/g, '');
      if (formElementToSetColor.length < 14) {
        this.dataElementService
          .getDataElement(formElementToSetColor)
          .subscribe((elemResponse) => {
            if (elemResponse) {
              elemResponse?.id +
                '-' +
                elemResponse?.categoryCombo?.categoryOptionCombos.forEach(
                  (option) => {
                    try {
                      document.getElementById(
                        option?.id + '-val'
                      ).style.backgroundColor = '#3667f2';
                    } catch (e) {}
                  }
                );
            }
          });
      } else {
        try {
          document.getElementById(
            elem
              .replace(/[#\{\}]/g, '')
              .split('.')
              .join('-') + '-val'
          ).style.backgroundColor = '#3667f2';
        } catch (e) {}
      }
    });
  }
}
