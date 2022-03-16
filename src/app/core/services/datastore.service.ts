import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  createNameSpaceIfMissing(): Observable<string[]> {
    const configurations = {};
    return this.httpClient
      .post(`dataStore/dhis2-user-support/configurations`, configurations)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  getDataStoreKeys(): Observable<string[]> {
    return this.httpClient.get('dataStore/dhis2-user-support').pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getUserSupportConfigurations(): Observable<any> {
    return this.httpClient
      .get('dataStore/dhis2-user-support/configurations')
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  getDataViaKey(key: string): Observable<any> {
    return this.httpClient.get(`dataStore/dhis2-user-support/${key}`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
