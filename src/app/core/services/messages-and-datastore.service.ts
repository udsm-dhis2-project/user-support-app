import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagesAndDatastoreService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  createMessageAndUpdateDataStore(
    messageData: any,
    dataStoreInformation: any
  ): Observable<any> {
    return zip(
      this.httpClient.post(
        `messageConversations/feedback?subject=${messageData?.subject}`,
        messageData?.text
      ),
      this.httpClient.post(
        `dataStore/dhis2-user-support/${dataStoreInformation?.id}`,
        dataStoreInformation
      )
    ).pipe(
      map((responses) => {
        return responses;
      }),
      catchError((error) => of(error))
    );
  }

  searchMessageConversationByTicketNumber(
    searchingText: string
  ): Observable<any> {
    return this.httpClient
      .get(
        `messageConversations?messageType=TICKET&filter=subject:ilike:${searchingText}`
      )
      .pipe(
        map((response) => {
          return response?.messageConversations[0] || 'none';
        }),
        catchError((error) => of(error))
      );
  }
}
