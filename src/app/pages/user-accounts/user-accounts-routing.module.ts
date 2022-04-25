import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAccountDashboardComponent } from './pages/create-account-dashboard/create-account-dashboard.component';
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component';
import { RequestUserAccountsComponent } from './pages/request-user-accounts/request-user-accounts.component';
import { UserAccountsHomeComponent } from './pages/user-accounts-home/user-accounts-home.component';
import { UsersDashboardComponent } from './pages/users-dashboard/users-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: UserAccountsHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: UsersDashboardComponent,
      },
      {
        path: 'new',
        component: CreateAccountDashboardComponent,
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
