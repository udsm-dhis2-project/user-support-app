import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagesDataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getFeedbacksByStatus(
    status: string,
    stardDate: Date,
    endDate: Date
  ): Observable<any[]> {
    return this.httpClient
      .get(
        `messageConversations.json?fields=id,status&filter=status:eq:${status}&filter=lastUpdated:gt:${stardDate}&filter=lastUpdated:lt:${endDate}&filter=messageType:eq:TICKET`
      )
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }
}
