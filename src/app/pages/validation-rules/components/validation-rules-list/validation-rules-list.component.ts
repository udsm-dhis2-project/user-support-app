import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationRulesService } from 'src/app/core/services/validation-rules.service';

@Component({
  selector: 'app-validation-rules-list',
  templateUrl: './validation-rules-list.component.html',
  styleUrls: ['./validation-rules-list.component.css'],
})
export class ValidationRulesListComponent implements OnInit {
  validationRules$: Observable<any[]>;
  @Output() editValidation = new EventEmitter<any>();
  @Output() deleteValidation = new EventEmitter<any>();
  dataSource: any;
  constructor(private validationRulesService: ValidationRulesService) {}

  ngOnInit(): void {
    this.validationRules$ = this.validationRulesService.getValidationRules();
  }

  searchValidationRule(event: any): void {
    const searchingText = event.target.value;
    this.validationRules$ =
      this.validationRulesService.getValidationRules(searchingText);
  }

  onEdit(event?: Event, validationRule?: any): void {
    if (event) {
      event.stopPropagation();
    }
    this.editValidation.emit(validationRule);
  }

  onDelete(event?: Event, validationRule?: any): void {
    if (event) {
      event.stopPropagation();
    }
    this.deleteValidation.emit(validationRule);
  }
}
