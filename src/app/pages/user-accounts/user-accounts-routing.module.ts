import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component';
import { RequestUserAccountsComponent } from './pages/request-user-accounts/request-user-accounts.component';
import { UserAccountsHomeComponent } from './pages/user-accounts-home/user-accounts-home.component';

const routes: Routes = [
  {
    path: '',
    component: UserAccountsHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'request',
        pathMatch: 'full',
      },
      {
        path: 'request',
        component: RequestUserAccountsComponent,
      },
      {
        path: 'password-recovery',
        component: PasswordRecoveryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountsRoutingModule {}
