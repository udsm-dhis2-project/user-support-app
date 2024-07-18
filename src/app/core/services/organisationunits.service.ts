import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { orderBy } from 'lodash';
import { OrgUnitLevelsModel } from 'src/app/shared/models/organisation-units.model';

@Injectable({
  providedIn: 'root',
})
export class OrgUnitsProvisionalService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getOrgUnitLevels(hightestLevel?: number): Observable<OrgUnitLevelsModel[]> {
    return this.httpClient
      .get(
        `organisationUnitLevels.json?fields=id,name,level${
          hightestLevel ? '&filter=level:gt:' + (hightestLevel - 1) : ''
        }`
      )
      .pipe(
        map((response: any) => {
          return orderBy(response?.organisationUnitLevels, ['level'], ['desc']);
        }),
        catchError((error) => of(error))
      );
  }

  getOrganisationUnitsDetails(parameters: string[]): Observable<any> {
    return this.httpClient
      .get(`organisationUnits.json?${parameters.join('&')}`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }
}
