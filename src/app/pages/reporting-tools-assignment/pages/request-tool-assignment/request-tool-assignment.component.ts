import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';

@Component({
  selector: 'app-request-tool-assignment',
  templateUrl: './request-tool-assignment.component.html',
  styleUrls: ['./request-tool-assignment.component.css'],
})
export class RequestToolAssignmentComponent implements OnInit {
  currentUser$: Observable<any>;
  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
  }
}
