import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getPrograms(paginationDetails: any): Observable<any> {
    return this.httpClient
      .get(
        `programs.json?fields=-id,name,attributeValues,organisationUnits~size${
          paginationDetails?.page ? '&page=' + paginationDetails?.page : ''
        }${
          paginationDetails?.pageSize
            ? '&pageSize=' + paginationDetails?.pageSize
            : ''
        }${
          paginationDetails?.searchingText
            ? '&filter=name:ilike:' +
              paginationDetails?.searchingText.toLowerCase()
            : ''
        }`
      )
      .pipe(
        map((response) => response),
        catchError((error: any) => of(error))
      );
  }

  getAllPrograms(): Observable<any[]> {
    return this.httpClient
      .get(`programs.json?paging=false&fields=id,name,attributeValues`)
      .pipe(
        map((response) =>
          response?.programs?.map((program: any) => {
            return {
              ...program,
              type: 'program',
            };
          })
        ),
        catchError((error: any) => of(error))
      );
  }
}
