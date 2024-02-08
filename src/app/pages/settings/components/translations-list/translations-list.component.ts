import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-translations-list',
  templateUrl: './translations-list.component.html',
  styleUrl: './translations-list.component.css',
})
export class TranslationsListComponent implements OnInit {
  @Input() configurations: any;
  @Input() key: string;
  selectedLanguageTranslations$: Observable<any>;
  constructor(private dataStoreService: DataStoreDataService) {}

  ngOnInit(): void {
    this.selectedLanguageTranslations$ = this.dataStoreService.getKeyData(
      this.key
    );
  }

  onGetTranslationValue(event, keyword: string): void {
    console.log('event', event);
    console.log('keyword', keyword);
  }

  oGetUpdatedValue(event, keyword: string): void {
    console.log(event);
    console.log(keyword);
  }
}
