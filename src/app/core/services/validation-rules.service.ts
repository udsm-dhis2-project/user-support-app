import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ValidationRulesService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getValidationRules(searchingText?: string): Observable<any[]> {
    return this.httpClient
      .get(
        `validationRules.json?fields=id,name&pageSize=10&paging=true${
          searchingText
            ? '&filter=name:ilike:' + searchingText.toLowerCase()
            : ''
        }`
      )
      .pipe(map((response) => response?.validationRules));
  }

  getValidationRuleDetails(rule): Observable<any> {
    return this.httpClient.get(
      `validationRules/${rule?.id}.json?fields=id,name,shortName,description,*`
    );
  }

  saveValidationRule(rule): Observable<any> {
    if (rule?.id) {
      return this.httpClient.put(
        `validationRules/${rule?.id}?mergeMode=REPLACE`,
        rule
      );
    } else {
      return this.httpClient.post('validationRules.json', rule);
    }
  }
}
