import { Component, Input, OnInit } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { omitBy } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { NewLanguageDialogComponent } from '../new-language-dialog/new-language-dialog.component';

@Component({
  selector: 'app-translations-list',
  templateUrl: './translations-list.component.html',
  styleUrl: './translations-list.component.css',
})
export class TranslationsListComponent implements OnInit {
  @Input() configurations: any;
  @Input() key: string;
  configurations$: Observable<any>;


  selectedLanguageTranslations$: Observable<any>;
  updatedKeys: any = {};
  shouldBeUpdated: boolean = false;
  constructor(
    private dataStoreService: DataStoreDataService,
    private dialog: MatDialog,
    
    ) {}

  ngOnInit(): void {
    this.selectedLanguageTranslations$ = this.dataStoreService.getKeyData(
      this.key,
    );

    this.getConfigs();
  }

  getConfigs(): void {
    this.configurations$ = this.dataStoreService.getKeyData(`configurations`);
  }

  onGetTranslationValue(
    value: string,
    keyword: string,
    selectedLanguageTranslations: any
  ): void {
    if (value) this.updatedKeys[keyword] = value;
    this.shouldBeUpdated =
      Object.keys(omitBy(selectedLanguageTranslations, (value) => value === ''))
        ?.length <
      Object.keys(
        omitBy(
          { ...selectedLanguageTranslations, ...this.updatedKeys },
          (value) => value === ''
        )
      )?.length;

    if (!this.shouldBeUpdated) {
      Object.keys(this.updatedKeys).forEach((key: string) => {
        if (selectedLanguageTranslations[key] != this.updatedKeys[key]) {
          this.shouldBeUpdated = true;
        }
      });
    }
  }

  updateTranslation(event: Event, selectedLanguageTranslations: any): void {
    event.stopPropagation();
    this.dataStoreService
      .updateDataStoreKey(this.key, {
        ...selectedLanguageTranslations,
        ...this.updatedKeys,
      })
      .subscribe((response: any) => {
        if (response) {
          this.selectedLanguageTranslations$ = this.dataStoreService.getKeyData(
            this.key
          );
        }
      });
  }


  private updateConfigurations(newLanguage: any): void {
    this.configurations$
      .pipe(
        take(1),
        switchMap((configurations: any) => {
          configurations.languages.push(newLanguage);

          return this.dataStoreService.updateDataStoreKey(
            'configurations',
            configurations
          );
        })
      )
      .subscribe(() => this.getConfigs());
  }

  private createDataStoreKey(key: string): void {
    this.configurations$
      .pipe(
        take(1),
        switchMap((configurations: any) => {
          const resultObject: { [key: string]: string } = {};

          for (const item of configurations.translationKeywords) {
            resultObject[item] = '';
          }
          return this.dataStoreService.createDataStoreKey(key, resultObject);
        })
      )
      .subscribe();
  }
  openDialog(): void {
    this.configurations$
      .pipe(
        take(1),
        switchMap((configurations: any) => {
          const dialogRef = this.dialog.open(NewLanguageDialogComponent, {
            width: '300px',
            data: { keyedKeyWords: configurations?.languages },
          });

          return dialogRef.afterClosed();
        })
      )
      .subscribe((result: any) => {
        if (result) {
          this.updateConfigurations(result);
          this.createDataStoreKey(result.key);
          // Additional logic for appending keywords wit                                                                              h new language and key
        }
      });
  }
}
