import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

@Component({
  selector: 'app-duplicate-user-accounts-list-modal',
  templateUrl: './duplicate-user-accounts-list-modal.component.html',
  styleUrl: './duplicate-user-accounts-list-modal.component.css',
})
export class DuplicateUserAccountsListModalComponent implements OnInit {
  translations$: Observable<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
  }
}
