import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStoreService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';

@Component({
  selector: 'app-request-tool-assignment',
  templateUrl: './request-tool-assignment.component.html',
  styleUrls: ['./request-tool-assignment.component.css'],
})
export class RequestToolAssignmentComponent implements OnInit {
  currentUser$: Observable<any>;
  configurations$: Observable<any>;
  constructor(
    private store: Store<State>,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.configurations$ = this.dataStoreService.getUserSupportConfigurations();
  }
}
