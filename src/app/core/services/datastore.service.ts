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
}
