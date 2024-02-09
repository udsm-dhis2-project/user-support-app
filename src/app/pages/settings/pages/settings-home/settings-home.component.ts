import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap, take } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';
import { CreateRoleModalComponent } from '../../modals/create-role-modal/create-role-modal.component';
import { SharedDeleteConfigItemModalComponent } from '../../modals/shared-delete-config-item-modal/shared-delete-config-item-modal.component';
import { CreateGroupModalComponent } from '../../modals/create-group-modal/create-group-modal.component';
import { MatSelectChange } from '@angular/material/select';
import { NewLanguageDialogComponent } from '../../components/new-language-dialog/new-language-dialog.component';
import {
  getCurrentSettingsSelectedLanguageKey,
  getCurrentTranslations,
} from 'src/app/store/selectors/translations.selectors';
import { setSelectedSettingsLanguageKey } from 'src/app/store/actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedConfirmationModalComponent } from '../../modals/shared-confirmation-modal/shared-confirmation-modal.component';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.css',
})
export class SettingsHomeComponent implements OnInit {
  configurations$: Observable<any>;
  currentUser$: Observable<any>;
  translations$: Observable<any>;
  saving: boolean = false;
  selectedLanguage: { name: string; key: string };
  selectedLanguageKey: string;
  selectedLanguageTranslations$: Observable<any>;
  translations: any = {};
  selectedSettingsLanguageKey$: Observable<string>;
  constructor(
    private dataStoreService: DataStoreDataService,
    private store: Store<State>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.selectedSettingsLanguageKey$ = this.store.select(
      getCurrentSettingsSelectedLanguageKey
    );
    this.currentUser$ = this.store.select(getCurrentUser);
    this.translations$ = this.store.select(getCurrentTranslations);
    this.getConfigs();
  }

  getConfigs(): void {
    this.configurations$ = this.dataStoreService.getKeyData(`configurations`);
  }

  onAddNewRole(event: Event, configurations: any): void {
    event.stopPropagation();
    this.dialog
      .open(CreateRoleModalComponent, {
        minWidth: '30%',
        data: {
          configurations,
        },
      })
      .afterClosed()
      .subscribe((configs: any) => {
        if (configs) {
          this.configurations$ = of(configs);
        }
      });
  }

  onAddNewGroup(event: Event, configurations: any): void {
    event.stopPropagation();
    this.dialog
      .open(CreateGroupModalComponent, {
        minWidth: '30%',
        data: {
          configurations,
        },
      })
      .afterClosed()
      .subscribe((configs: any) => {
        if (configs) {
          this.configurations$ = of(configs);
        }
      });
  }

  onDelete(item: any, configurations: any, type: string): void {
    this.dialog
      .open(SharedDeleteConfigItemModalComponent, {
        minWidth: '20%',
        data: {
          title: 'Confirmation',
          message: `Are you sure to delete ${item?.name}?`,
        },
      })
      .afterClosed()
      .subscribe((shouldDelete: boolean) => {
        if (shouldDelete) {
          this.saving = true;
          const newConfigurations = {
            ...configurations,
            allowedUserRolesForRequest:
              type === 'group'
                ? configurations?.allowedUserRolesForRequest
                : configurations?.allowedUserRolesForRequest?.filter(
                    (role: any) => role?.id !== item?.id
                  ) || [],
            allowedUserGroupsForRequest:
              type !== 'group'
                ? configurations?.allowedUserGroupsForRequest
                : configurations?.allowedUserGroupsForRequest?.filter(
                    (group: any) => group?.id !== item?.id
                  ) || [],
          };

          this.dataStoreService
            .updateDataStoreKey(`configurations`, newConfigurations)
            .subscribe((response: any) => {
              if (response) {
                this.saving = false;
                this.getConfigs();
              }
            });
        }
      });
  }

  onEdit(item: any, configurations: any, type: string): void {
    if (type === 'role') {
      this.dialog
        .open(CreateRoleModalComponent, {
          minWidth: '30%',
          data: {
            configurations,
            role: item,
          },
        })
        .afterClosed()
        .subscribe((configs: any) => {
          if (configs) {
            this.configurations$ = of(configs);
          }
        });
    } else {
      this.dialog
        .open(CreateGroupModalComponent, {
          minWidth: '30%',
          data: {
            configurations,
            group: item,
          },
        })
        .afterClosed()
        .subscribe((configs: any) => {
          if (configs) {
            this.configurations$ = of(configs);
          }
        });
    }
  }

  getSelectedLanguage(event: MatSelectChange): void {
    this.selectedLanguageKey = event.value;
    this.selectedSettingsLanguageKey$ = of(null);
    this.store.dispatch(
      setSelectedSettingsLanguageKey({
        key: this.selectedLanguageKey,
      })
    );
    setTimeout(() => {
      this.selectedSettingsLanguageKey$ = this.store.select(
        getCurrentSettingsSelectedLanguageKey
      );
    }, 50);
  }

  getSelectedLanguageTranslations() {
    /**
     * Steps:
     * 1. Dispatch action to load translations using language key
     * 2. Use select to get the translations
     */
    this.selectedLanguageTranslations$ = this.dataStoreService.getKeyData(
      this.selectedLanguageKey
    );
  }

  onGetTranslationValue(translationValue: string, keyword: string): void {
    this.translations[keyword] = translationValue;
    // console.log(translationValue + 'The best we can do');
  }

  getUpdatedValue(updatedValue: string, keyword: string): void {
    // this.translations[keyword] = translationValue;
    console.log(updatedValue + 'The best we can do');
  }

  openDialog(): void {
    this.configurations$
      .pipe(
        take(1),
        switchMap((configurations: any) => {
          const dialogRef = this.dialog.open(NewLanguageDialogComponent, {
            width: '300px',
            data: { keyedKeyWords: configurations?.languages },
          });

          return dialogRef.afterClosed();
        })
      )
      .subscribe((result: any) => {
        if (result) {
          this.updateConfigurations(result);
          this.createDataStoreKey(result.key);
          // Additional logic for appending keywords wit                                                                              h new language and key
        }
      });
  }

  private updateConfigurations(newLanguage: any): void {
    this.configurations$
      .pipe(
        take(1),
        switchMap((configurations: any) => {
          configurations.languages.push(newLanguage);

          return this.dataStoreService.updateDataStoreKey(
            'configurations',
            configurations
          );
        })
      )
      .subscribe(() => this.getConfigs());
  }

  private createDataStoreKey(key: string): void {
    this.configurations$
      .pipe(
        take(1),
        switchMap((configurations: any) => {
          const resultObject: { [key: string]: string } = {};

          for (const item of configurations.translationKeywords) {
            resultObject[item] = '';
          }
          return this.dataStoreService.createDataStoreKey(key, resultObject);
        })
      )
      .subscribe();
  }

  onOpenDefaultLanguageConfirmationModal(
    event: MatCheckboxChange,
    configurations: any,
    key: string
  ): void {
    console.log(event);
    this.dialog
      .open(SharedConfirmationModalComponent, {
        minWidth: '25%',
        data: {
          title: 'Confirmation',
          message: !event?.checked
            ? 'Are you sure to remove default language?'
            : 'Are you sure to set this as default language, it will replace existing one?',
        },
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dataStoreService
            .updateDataStoreKey('configurations', {
              ...configurations,
              defaultLocale: event.checked ? key : null,
            })
            .subscribe((response: any) => {
              if (response) {
                this.getConfigs();
              }
            });
        }
      });
  }
}
