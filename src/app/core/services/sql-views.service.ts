import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SqlViewsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getSqlViewByParameters(parameters: {
    id: string;
    pagination?: { paging?: boolean; page?: number; pageCount?: number };
  }): Observable<any> {
    let params = '';
    if (parameters?.pagination?.paging === false) {
      params = 'paging=false';
    }
    return this.httpClient
      .get(`sqlViews/${parameters?.id}/data?${params}`)
      .pipe(
        map((response) => {
          return { ...response, sqlView: { id: parameters?.id } };
        }),
        catchError((error) => of(error))
      );
  }

  mergeOus(
    id: string,
    sourceUid: string,
    destinationUid: string
  ): Observable<any> {
    return this.httpClient
      .get(
        `sqlViews/${id}/data?var=sourceUid:${sourceUid}&var=destinationId:${destinationUid}`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }
}
