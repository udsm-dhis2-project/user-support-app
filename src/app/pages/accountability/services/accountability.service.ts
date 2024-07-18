import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { map, Observable, switchMap, zip } from 'rxjs';
import { AccountabilityData } from '../models/accountability.model';
import moment from 'moment';
import { sum } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AccountabilityService {
  constructor(private httpClientService: NgxDhis2HttpClientService) {}

  getUsersAndMessageConversations(
    userGroupId: string,
    selectedPeriod: { startDate: Date; endDate: Date }
  ): Observable<any> {
    return this.httpClientService
      .get(
        `userGroups/${userGroupId}.json?fields=id,nme,users[id,name,username]`
      )
      .pipe(
        switchMap((userGroupResponse: any) => {
          const startDate = moment(selectedPeriod?.startDate).format(
            'YYYY-MM-DD'
          );
          const endDate = moment(selectedPeriod?.endDate).format('YYYY-MM-DD');
          return zip(
            ...userGroupResponse?.users.map((user: any) =>
              zip(
                this.httpClientService.get(
                  `messageConversations?fields=id,name,subjec,messageType,messageCount,createdBy&queryString=${user?.username}` +
                    `&filter=created:lt:${endDate}&filter=created:gt:${startDate}&filter=subject:ilike:ACCOUNT REQUEST`
                ),
                this.httpClientService.get(
                  `messageConversations?fields=id,name,subjec,messageType,messageCount,createdBy&queryString=${user?.username}` +
                    `&filter=created:lt:${endDate}&filter=created:gt:${startDate}&filter=subject:ilike:FORM REQUEST`
                ),
                this.httpClientService.get(
                  `indicators?fields=id,name,lastUpdatedBy,lastUpdated&filter=lastUpdatedBy.username:eq:${user?.username}` +
                    `&filter=lastUpdated:lt:${endDate}&filter=lastUpdated:gt:${startDate}`
                )
              ).pipe(
                map((responses: any[]) => {
                  const formattedAccPayload = responses.map((response: any) => {
                    return new AccountabilityData(
                      response,
                      null,
                      null
                    ).toJson();
                  });
                  return {
                    user,
                    count: sum(
                      formattedAccPayload.map((output: any) => output?.count)
                    ),
                    formattedAccPayload,
                  };
                })
              )
            )
          );
        })
      );
  }
}
