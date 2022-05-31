import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataSetsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getDataSets(searchingText: string): Observable<any> {
    return this.httpClient
      .get(
        `dataSets.json?fields=id,name,dataEntryForm[*]${
          searchingText
            ? '&filter=name:ilike:' + searchingText.toLowerCase()
            : ''
        }`
      )
      .pipe(map((response) => response?.dataSets));
  }
}
