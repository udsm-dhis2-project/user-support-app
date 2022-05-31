import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationRulesService } from 'src/app/core/services/validation-rules.service';

@Component({
  selector: 'app-validation-rules-list-container',
  templateUrl: './validation-rules-list-container.component.html',
  styleUrls: ['./validation-rules-list-container.component.css'],
})
export class ValidationRulesListContainerComponent implements OnInit {
  @Output() editValidationRule = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  onEditValidationRule(validationRule): void {
    this.editValidationRule.emit(validationRule);
  }
}
