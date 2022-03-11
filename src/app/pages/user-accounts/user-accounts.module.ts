import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountsRoutingModule } from './user-accounts-routing.module';
import { userAccountsPages } from './pages';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [...userAccountsPages],
  imports: [CommonModule, UserAccountsRoutingModule, SharedModule],
})
export class UserAccountsModule {}
