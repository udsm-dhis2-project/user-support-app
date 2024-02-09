import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { omitBy } from 'lodash';

@Component({
  selector: 'app-translations-list',
  templateUrl: './translations-list.component.html',
  styleUrl: './translations-list.component.css',
})
export class TranslationsListComponent implements OnInit {
  @Input() configurations: any;
  @Input() key: string;
  selectedLanguageTranslations$: Observable<any>;
  updatedKeys: any = {};
  shouldBeUpdated: boolean = false;
  constructor(private dataStoreService: DataStoreDataService) {}

  ngOnInit(): void {
    this.selectedLanguageTranslations$ = this.dataStoreService.getKeyData(
      this.key
    );
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
        this.selectedLanguageTranslations$ = this.dataStoreService.getKeyData(
          this.key
        );
      });
  }
}
