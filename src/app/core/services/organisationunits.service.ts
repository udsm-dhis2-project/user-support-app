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

  getOrgUnitLevels(): Observable<OrgUnitLevelsModel[]> {
    return this.httpClient
      .get(`organisationUnitLevels.json?fields=id,name,level`)
      .pipe(
        map((response: any) => {
          return orderBy(response?.organisationUnitLevels, ['level'], ['desc']);
        }),
        catchError((error) => of(error))
      );
  }
}
