import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { omit, uniqBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ApproveFeedbackService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  approveChanges(data: any): Observable<any> {
    if (data?.method === 'POST') {
      return zip(
        this.httpClient.post(
          data?.url,
          omit(data?.payload, 'dataSetAttributesData')
        ),
        this.httpClient.delete(`dataStore/dhis2-user-support/${data?.id}`),
        data?.messageConversation
          ? this.httpClient.post(
              `messageConversations/${data?.messageConversation?.id}`,
              data?.approvalMessage
            )
          : this.httpClient.post(`messageConversations`, data?.messageBody),
        data?.dataSetsCategoriesPayload?.length > 0
          ? zip(
              ...data?.dataSetsCategoriesPayload?.map((categoryPayload) => {
                return this.httpClient.put(
                  `categoryOptions/${categoryPayload?.id}?mergeMode=REPLACE`,
                  categoryPayload
                );
              })
            ).pipe(map((responses) => responses))
          : of(null),
        data?.messageConversation
          ? this.httpClient.post(
              `messageConversations/${data?.messageConversation?.id}/status?messageConversationStatus=SOLVED`,
              null
            )
          : of(null)
      ).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else if (data?.method === 'PUT') {
      return this.httpClient
        .put(data?.url, omit(data?.payload, 'dataSetAttributesData'))
        .pipe(
          map((response) => response),
          catchError((error) => of(error))
        );
    } else {
      return of(null);
    }
  }

  rejectDataSetAssignment(data: any): Observable<any> {
    return zip(
      this.httpClient.put(`dataStore/dhis2-user-support/${data?.id}`, data),
      data?.messageConversation
        ? this.httpClient.post(
            `messageConversations/${data?.messageConversation?.id}`,
            data?.rejectionReasonMessage
          )
        : this.httpClient.post(`messageConversations`, data?.messageBody)
    ).pipe(
      map((response) => response),
      catchError((error) => error)
    );
  }
}
