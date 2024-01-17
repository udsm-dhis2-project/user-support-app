import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';
import { CreateRoleModalComponent } from '../../modals/create-role-modal/create-role-modal.component';
import { SharedDeleteConfigItemModalComponent } from '../../modals/shared-delete-config-item-modal/shared-delete-config-item-modal.component';
import { CreateGroupModalComponent } from '../../modals/create-group-modal/create-group-modal.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.css',
})
export class SettingsHomeComponent implements OnInit {
  configurations$: Observable<any>;
  currentUser$: Observable<any>;
  saving: boolean = false;
  selectedLanguage: { name: string; key: string };
  selectedLanguageTranslations$: Observable<any>;
  translations: any = {};
  constructor(
    private dataStoreService: DataStoreDataService,
    private store: Store<State>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
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
    this.selectedLanguage = event.value;
  }

  getSelectedLanguageTranslations() {
    /**
     * Steps:
     * 1. Dispatch action to load translations using language key
     * 2. Use select to get the translations
     */
    // this.selectedLanguageTranslations$ = st
  }

  getTranslationValue(translationValue: string, keyword: string): void {
    this.translations[keyword] = translationValue;
    console.log(this.translations);
  }
}
