import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IndicatorsService } from 'src/app/core/services/indicators.service';
import { OrgUnitsProvisionalService } from 'src/app/core/services/organisationunits.service';

@Component({
  selector: 'app-alma-export-home',
  templateUrl: './alma-export-home.component.html',
  styleUrl: './alma-export-home.component.css',
})
export class AlmaExportHomeComponent implements OnInit {
  organisationUnitsLevels$: Observable<any>;
  indicatorGroups$: Observable<any>;
  selectedOuLevel: any;
  selectedIndcicatorGroup: any;
  indicators$: Observable<any>;
  indicatorFields: string =
    'indicators[id,name,shortName,indicatorType[id,name],numeratorDescription,denominatorDescription,indicatorGroups[id,name]]';
  selectedIndicators: any[] = [];
  downloading: boolean = false;
  constructor(
    private ouService: OrgUnitsProvisionalService,
    private indicatorsService: IndicatorsService
  ) {}

  ngOnInit(): void {
    this.organisationUnitsLevels$ = this.ouService.getOrgUnitLevels().pipe(
      map((levelsData: any) => {
        return levelsData.map((ouLevel: any) => {
          return {
            ...ouLevel,
            id: ouLevel?.level,
          };
        });
      })
    );
    this.indicatorGroups$ = this.indicatorsService.getIndicatorGroups([
      'fields=id,displayName,indicators~size',
      'paging=false',
    ]);
  }

  onGetSelectedOuLevel(ouLevel: any): void {
    this.selectedOuLevel = ouLevel;
  }
  onGetSelectedIndicatorGroup(indicatorGroup: any): void {
    this.selectedIndcicatorGroup = indicatorGroup;
    this.indicators$ = this.indicatorsService.getIndicatorsByIndicatorGroup(
      this.selectedIndcicatorGroup,
      this.indicatorFields
    );
  }

  onGetSelectedIndicators(indicators: any[]): void {
    this.selectedIndicators = indicators;
  }

  onExport(event: Event): void {
    event.stopPropagation();
    this.downloading = true;
    this.ouService
      .getOrganisationUnitsDetails([
        'fields=id,parent[id],name,level,featureType,coordinates,geometry',
        'paging=false',
        'filter=level:eq:' + this.selectedOuLevel,
      ])
      .subscribe((ousResponse: any) => {
        const data = {
          organisationUnits: {
            organisationUnits: ousResponse?.organisationUnits?.map(
              (orgUnit: any) => {
                return {
                  name: orgUnit?.name,
                  parent: orgUnit?.parent,
                  id: orgUnit?.id,
                  level: orgUnit?.level,
                  coordinates: orgUnit?.geometry?.coordinates,
                  featureType: orgUnit?.geometry?.type,
                };
              }
            ),
          },
          indicators: this.selectedIndicators,
        };
        this.downloading = false;
        this.downloadFile(data);
      });
  }

  private downloadFile(data: any): void {
    let jsonData = JSON.stringify(data);

    //Convert JSON string to BLOB.
    let blodData = new Blob([jsonData], { type: 'text/plain;charset=utf-8' });

    //Check the Browser.
    let isIE = false;
    if (isIE) {
      // window.navigator.msSaveBlob(blob1, "datasetqueries.json");
    } else {
      let url = window.URL || window.webkitURL;
      let link = url.createObjectURL(blodData);
      let a = document.createElement('a');
      a.download = `organisationUnits_indicators.json`;
      a.href = link;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
