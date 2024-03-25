import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-validation-rules-request',
  templateUrl: './validation-rules-request.component.html',
  styleUrls: ['./validation-rules-request.component.css'],
})
export class ValidationRulesRequestComponent implements OnInit, OnChanges {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  canRequest: boolean = false;
  canApprove: boolean = false;
translations$: Observable<any>;
  constructor(private store: Store<State>) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.canApprove =
      this.currentUser?.keyedAuthorities['VALIDATION_RULE_APPROVE'];
    this.canRequest =
      this.currentUser?.keyedAuthorities['VALIDATION_RULE_REQUEST'];
  }
}
