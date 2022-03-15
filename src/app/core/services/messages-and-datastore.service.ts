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
        'messageConversations?messageType=TICKET',
        messageData
      ),
      this.httpClient.post(
        `dataStore/user-support/${dataStoreInformation?.id}`,
        dataStoreInformation
      )
    ).pipe(
      map((responses) => {
        return responses;
      }),
      catchError((error) => of(error))
    );
  }
}
