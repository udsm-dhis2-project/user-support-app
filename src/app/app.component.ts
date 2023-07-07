import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Fn } from '@iapps/function-analytics';
import { Store } from '@ngrx/store';
import { State } from './store/reducers';
import { Observable } from 'rxjs';
import { getCurrentUser } from './store/selectors';
import { MatDialog } from '@angular/material/dialog';
import { MessagesModalComponent } from './shared/components/messages-modal/messages-modal.component';
import { DataStoreDataService } from './core/services/datastore.service';
import { loadSystemConfigurations } from './store/actions';
import { getSystemConfigs } from './store/selectors/system-configurations.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userSupportNameSpaceResponse$: Observable<any>;
  systemSettings$: Observable<any>;
  ready: boolean = false;
  configurations$: Observable<any>;

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private store: Store<State>,
    private dialog: MatDialog,
    private dataStoreService: DataStoreDataService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // Set application title
    this.setTitle('User Support');

    if (Fn) {
      Fn.init({
        baseUrl: '../../../',
      });
    }
  }

  onChangeLanguage(event: Event): void {
    const locale = (event?.target as HTMLInputElement)?.value;
    this.ready = false;
    setTimeout(() => {
      this.translate.use(locale);
      this.ready = true;
    }, 50);
  }

  currentUser$: Observable<any>;

  ngOnInit(): void {
    this.ready = true;
    this.currentUser$ = this.store.select(getCurrentUser);
    // Check if the key dhis2-user-support exists on datastore, otherwise create withd default configurations
    this.userSupportNameSpaceResponse$ =
      this.dataStoreService.createNameSpaceIfMissing();
    this.userSupportNameSpaceResponse$.subscribe((response) => {
      if (response) {
        this.configurations$ =
          this.dataStoreService.getUserSupportConfigurations();
        this.configurations$.subscribe((response) => {
          if (response) {
            this.translate.use(response?.defaultLocale);
          }
        });
      }
    });
    this.store.dispatch(loadSystemConfigurations());
    this.systemSettings$ = this.store.select(getSystemConfigs);
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  newMessageModal(event: Event, currentUser: any): void {
    event.stopPropagation();
    this.dialog.open(MessagesModalComponent, {
      width: '50%',
      data: {
        action: 'create',
        currentUser,
      },
    });
  }
}
