import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApproveFeedbackService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  approveChanges(data: any): Observable<any> {
    if (data?.method === 'POST') {
      return zip(
        this.httpClient.post(data?.url, data?.payload),
        this.httpClient.delete(`dataStore/dhis2-user-support/${data?.id}`),
        this.httpClient.post(
          `messageConversations/${data?.messageConversation?.id}`,
          data?.approvalMessage
        )
      ).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else if (data?.method === 'PUT') {
      return this.httpClient.put(data?.url, data?.payload).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else {
      return of(null);
    }
  }
}