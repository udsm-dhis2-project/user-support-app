import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStoreService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-feedback-container',
  templateUrl: './feedback-container.component.html',
  styleUrls: ['./feedback-container.component.css'],
})
export class FeedbackContainerComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  isFeedbackRecepient: boolean = false;
  userSupportKeys$: Observable<string[]>;
  constructor(private dataStoreService: DataStoreService) {}

  ngOnInit(): void {
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
  }

  onDataStoreChange(event: boolean): void {
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
  }
}
