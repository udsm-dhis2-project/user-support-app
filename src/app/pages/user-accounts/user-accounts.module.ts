import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountsRoutingModule } from './user-accounts-routing.module';
import { userAccountsPages } from './pages';
import { SharedModule } from 'src/app/shared/shared.module';
import { accountsComponents } from './components';
import { accountsModals } from './modals';

@NgModule({
  declarations: [
    ...userAccountsPages,
    ...accountsComponents,
    ...accountsModals,
  ],
  imports: [CommonModule, UserAccountsRoutingModule, SharedModule],
})
export class UserAccountsModule {}
