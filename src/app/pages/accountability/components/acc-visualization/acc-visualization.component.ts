import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import Highcharts from 'highcharts';
declare var require: any;
const HighchartsGroupedCategories = require('highcharts-grouped-categories')(
    Highcharts
  ),
  HighchartsExporting = require('highcharts/modules/exporting')(Highcharts),
  OfflineHighchartExporting =
    require('highcharts/modules/offline-exporting.js')(Highcharts),
  HighchartsExportData = require('highcharts/modules/export-data')(Highcharts),
  HighchartsMore = require('highcharts/highcharts-more.js')(Highcharts),
  HighchartGauge = require('highcharts/modules/solid-gauge.js')(Highcharts),
  HighchartDrilldown = require('highcharts/modules/drilldown.js')(Highcharts);

@Component({
  selector: 'app-acc-visualization',
  templateUrl: './acc-visualization.component.html',
  styleUrl: './acc-visualization.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccVisualizationComponent implements OnInit {
  chartHeight: '350px';
  @Input() responsibilityPayload: any;
  ngOnInit(): void {
    this.responsibilityPayload = this.responsibilityPayload?.filter(
      (staffData) => staffData?.count > 0
    );
    const accRequests = this.responsibilityPayload.map((staffData) =>
      staffData?.formattedAccPayload[0]?.count
        ? staffData?.formattedAccPayload[0]?.count
        : 0
    );
    const formRequests = this.responsibilityPayload.map((staffData) =>
      staffData?.formattedAccPayload[1]?.count
        ? staffData?.formattedAccPayload[1]?.count
        : 0
    );
    const indUpdates = this.responsibilityPayload.map((staffData) =>
      staffData?.formattedAccPayload[2]?.count
        ? staffData?.formattedAccPayload[2]?.count
        : 0
    );
    console.log(accRequests);
    console.log(formRequests);
    console.log(indUpdates);
    const chart = (Highcharts as any).chart('vis-chart', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Accountability status',
        align: 'left',
      },
      xAxis: {
        categories: this.responsibilityPayload?.map(
          (staffData: any) => staffData?.user?.name
        ),
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count',
        },
        stackLabels: {
          enabled: true,
        },
      },
      legend: {
        align: 'left',
        x: 70,
        verticalAlign: 'top',
        y: 70,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      colors: this.getChartColors(),
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Acc requests',
          data: accRequests,
        },
        {
          name: 'Form requests',
          data: formRequests,
        },
        {
          name: 'Indicators updates',
          data: indUpdates,
        },
      ],
    });
  }

  getChartColors(): any[] {
    return [
      '#A9BE3B',
      '#558CC0',
      '#4FBDAE',
      '#B78040',
      '#FF9F3A',
      '#968F8F',
      '#B7409F',
      '#D34957',
      '#FFDA64',
      '#4FBDAE',
      '#B78040',
      '#676767',
      '#6A33CF',
      '#4A7833',
      '#434348',
      '#7CB5EC',
      '#F7A35C',
      '#F15C80',
    ];
  }
}
