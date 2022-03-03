import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { UserAccountsRoutingModule } from './user-accounts-routing.module';
import { userAccountsPages } from './pages';

@NgModule({
  declarations: [...userAccountsPages],
  imports: [CommonModule, SharedModule, UserAccountsRoutingModule],
})
export class UserAccountsModule {}
