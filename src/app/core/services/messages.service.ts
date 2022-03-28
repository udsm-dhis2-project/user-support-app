import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as async from 'async';

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

  getMessagesMatchingTicketNumbers(dataStoreIds: string[]): Observable<any> {
    let data = {};
    let errors = {};
    return new Observable((observer) => {
      async.mapLimit(
        dataStoreIds,
        10,
        async.reflect((key, callback) => {
          const searchingText = key.split('_')[0];
          this.httpClient
            .get(
              `messageConversations?messageType=TICKET&filter=subject:ilike:${searchingText}`
            )
            .subscribe(
              (results) => {
                data[key] = {
                  ...results?.messageConversations[0],
                  text: 'Ombi limesitishwa\n\n Tafadhali!',
                };
                callback(null, results);
              },
              (err) => {
                errors[key] = err;
                callback(err, null);
              }
            );
        }),
        () => {
          const response = {
            data,
            errors,
          };

          observer.next(data);
          observer.complete();
        }
      );
    });
  }
}
