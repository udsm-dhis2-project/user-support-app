import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IndicatorsService } from 'src/app/core/services/indicators.service';

@Component({
  selector: 'app-indicator-request',
  templateUrl: './indicator-request.component.html',
  styleUrl: './indicator-request.component.css',
})
export class IndicatorRequestComponent implements OnInit, OnChanges {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  indicatorTypes$: Observable<any>;
  translations$: Observable<any>;
  canApprove: boolean;
  canRequest: boolean;

  constructor(private indicatorService: IndicatorsService) {}

  ngOnInit(): void {
    this.indicatorTypes$ = this.indicatorService.getIndicatorTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canApprove = this.currentUser?.keyedAuthorities['ALL'];
    this.canRequest = this.currentUser?.keyedAuthorities['ALL'];
  }
}
