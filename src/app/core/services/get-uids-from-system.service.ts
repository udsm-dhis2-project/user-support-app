import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UIDsFromSystemService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getUidsFromSystem(limit: number): Observable<string[]> {
    return this.httpClient.get(`system/id.json?limit=${limit}`).pipe(
      map((response: any) => {
        return response?.codes;
      }),
      catchError((error) => of(error))
    );
  }
}
