import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { MetadataDescriptionService } from 'src/app/core/services/metadata-description.service';
import { Observable } from 'rxjs';
import { ValidationRulesService } from 'src/app/core/services/validation-rules.service';
import { DataelementsService } from 'src/app/core/services/dataelements.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DataSetsService } from 'src/app/core/services/dataset.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { RequestIndicatorModalComponent } from '../../modals/request-indicator-modal/request-indicator-modal.component';
import { IndicatorsService } from 'src/app/core/services/indicators.service';

@Component({
  selector: 'app-form-manipulation',
  templateUrl: './form-manipulation.component.html',
  styleUrl: './form-manipulation.component.css',
})
export class FormManipulationComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  @Input() indicatorTypes: any[];
  dataSets$: Observable<any[]>;
  indicatorId: string;
  searchString: string = '';
  _htmlMarkup: SafeHtml;
  dataSetCtrl: UntypedFormControl = new UntypedFormControl('');
  dataset: any;
  name: string;
  shortName: string;
  description: string;
  indicatorType: any;
  indicatorNumExpression: string;
  indicatorDenExpression: string;
  numDescription: string;
  denDescription: string;
  metadataIds: string[] = [];
  NumMetadataIds: string[] = [];
  DenMetadataIds: string[] = [];
  uids: string[] = [];
  expressionDescriptionNum$: Observable<any>;
  expressionDescriptionDen$: Observable<any>;
  curretOperatorId: string;
  selectedTab = new UntypedFormControl(0);
  currentuser$: Observable<any>;
  translations$: Observable<any>;
  decimals: number;
  code: string;
  annualized: boolean = false;

  isNumSet: boolean;
  isDenSet: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private metadataExpressionDescriptionService: MetadataDescriptionService,
    private dataElementService: DataelementsService,
    private dataSetsService: DataSetsService,
    private store: Store<State>,
    private indicatorsService: IndicatorsService
  ) {}

  ngOnInit(): void {
    // console.log(this.indicatorTypes);
    this.dataSets$ = this.dataSetsService.getDataSets('');
  }

  getExpressionDefinition(event, expressionPart): void {
    const expression = event.target.value;
    if (expressionPart === 'NUM') {
      this.isDenSet = false;
      this.isNumSet = true;
    } else if (expressionPart === 'DEN') {
      this.isDenSet = true;
      this.isNumSet = false;
    } else {
      this.isDenSet = false;
      this.isNumSet = false;
    }

    let self = this;

    if (self.isNumSet) {
      self.indicatorNumExpression = expression;
      self.expressionDescriptionNum$ =
        self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
          expression
        );
    } else {
      self.indicatorDenExpression = expression;
      self.expressionDescriptionDen$ =
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

  getSelectedItemFromOption(event: any): void {
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
              self.isNumSet ? '#36e1f2' : self.isDenSet ? '#3667f2' : '';
            console.log(
              "event.target.id.split('-').join('.').replace('.val', '') ",
              event.target.id.split('-').join('.').replace('.val', '')
            );
            if (self.isNumSet) {
              self.indicatorNumExpression =
                (self.indicatorNumExpression
                  ? self.indicatorNumExpression
                  : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionNum$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.indicatorNumExpression
                );
            } else if (self.isDenSet) {
              self.indicatorDenExpression =
                (self.indicatorDenExpression
                  ? self.indicatorDenExpression
                  : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionDen$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.indicatorDenExpression
                );
            } else {
              // No side selected
              self.indicatorNumExpression = '';
              self.indicatorDenExpression = '';
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
              self.isNumSet ? '#36e1f2' : self.isDenSet ? '#3667f2' : '';

            if (self.isNumSet) {
              self.indicatorNumExpression =
                (self.indicatorNumExpression
                  ? self.indicatorNumExpression
                  : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionNum$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.indicatorNumExpression
                );
            } else if (self.isDenSet) {
              self.indicatorDenExpression =
                (self.indicatorDenExpression
                  ? self.indicatorDenExpression
                  : '') +
                '#{' +
                event.target.id.split('-').join('.').replace('.val', '') +
                '}';
              self.expressionDescriptionDen$ =
                self.metadataExpressionDescriptionService.getMetadataExpressionDescription(
                  self.indicatorDenExpression
                );
            } else {
              // No side selected
              self.indicatorNumExpression = '';
              self.indicatorDenExpression = '';
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
    if (expressionPart == 'NUM') {
      this.indicatorNumExpression = expression + ' ' + operator + ' ';
    } else {
      this.indicatorDenExpression = expression + ' ' + operator + ' ';
    }
  }

  setActiveExpressionArea(event: Event, expressionPart): void {
    event.stopPropagation();
    if (expressionPart === 'NUM') {
      this.isNumSet = true;
      this.isDenSet = false;
    } else {
      this.isDenSet = true;
      this.isNumSet = false;
    }
  }

  onClear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.indicatorId = null;
    this.name = '';
    this.shortName = '';
    this.description = '';
    this.numDescription = '';
    this.denDescription = '';
    this.indicatorNumExpression = '';
    this.indicatorDenExpression = '';
    this.indicatorType = null;
    this.decimals = null;
  }

  onRequestIndicator(
    event: Event,
    expressionDescriptionNum: any,
    expressionDescriptionDen: any
  ): void {
    event.stopPropagation();
    const data = {
      id: this.indicatorId,
      denominatorDescription: this.denDescription,
      numeratorDescription: this.numDescription,
      numerator: this.indicatorNumExpression,
      denominator: this.indicatorDenExpression,
      name: this.name,
      shortName: this.shortName,
      code: this.code,
      decimals: this.decimals,
      indicatorType: this.indicatorType,
      legendSets: [],
      annualized: this.annualized,
    };
    this.dialog
      .open(RequestIndicatorModalComponent, {
        minWidth: '30%',
        data: {
          indicator: data,
          expressionDescriptionNum,
          expressionDescriptionDen,
          currentUser: this.currentUser,
          systemConfigs: this.systemConfigs,
        },
      })
      .afterClosed()
      .subscribe((confirmed?: boolean) => {
        if (confirmed) {
          this.onClear();
        }
      });
  }

  changeTab(index) {
    this.selectedTab.setValue(index);
  }

  onEditIndicator(indicator: any): void {
    this.selectedTab.setValue(0);
    this.indicatorId = indicator?.id;
    document.getElementsByName('entryfield').forEach((elem, index) => {
      elem.style.backgroundColor = '#FFF';
    });
    this.indicatorsService
      .getIndicatorDetails(
        indicator?.id,
        'id,name,shortName,code,decimals,indicatorType[id,name,factor],numerator,denominator,numeratorDescription,denominatorDescription,description,annualized'
      )
      .subscribe((response: any) => {
        // console.log(response);
        this.indicatorDenExpression = response?.denominator;
        this.indicatorNumExpression = response?.numerator;
        this.indicatorType = response?.indicatorType;
        // console.log(this.indicatorType);
        this.denDescription = response?.denominatorDescription;
        this.numDescription = response?.numeratorDescription;
        this.code = response?.code;
        this.decimals = response?.decimals;
        this.name = response?.name;
        this.shortName = response?.shortName;
        this.description = response?.description;
        this.annualized = response?.annualized;
        this.expressionDescriptionDen$ =
          this.metadataExpressionDescriptionService.getMetadataExpressionDescription(
            this.indicatorDenExpression
          );
        this.expressionDescriptionNum$ =
          this.metadataExpressionDescriptionService.getMetadataExpressionDescription(
            this.indicatorNumExpression
          );
      });
  }

  setColorsToElementsInExpressions(
    indicatorNumExpression,
    indicatorDenExpression
  ): void {
    const formulaPattern = /#\{.+?\}/g;
    indicatorNumExpression.match(formulaPattern).forEach((elem) => {
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

    indicatorDenExpression.match(formulaPattern).forEach((elem) => {
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

  getSkipRuleOnFormValidation(change): void {
    console.log(change);
  }
}
