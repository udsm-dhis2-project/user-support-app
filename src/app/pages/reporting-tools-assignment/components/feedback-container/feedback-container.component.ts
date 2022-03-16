import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStoreService } from 'src/app/core/services/datastore.service';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';

@Component({
  selector: 'app-feedback-container',
  templateUrl: './feedback-container.component.html',
  styleUrls: ['./feedback-container.component.css'],
})
export class FeedbackContainerComponent implements OnInit {
  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: SystemConfigsModel;
  isFeedbackRecepient: boolean = false;
  userSupportKeys$: Observable<string[]>;
  constructor(private dataStoreService: DataStoreService) {}

  ngOnInit(): void {
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
    console.log('systemConfigs', this.systemConfigs);
    console.log(this.currentUser);
  }

  onDataStoreChange(event: boolean): void {
    this.userSupportKeys$ = this.dataStoreService.getDataStoreKeys();
  }
}
