import { CreateAccountDashboardComponent } from './create-account-dashboard/create-account-dashboard.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { RequestUserAccountsComponent } from './request-user-accounts/request-user-accounts.component';
import { UserAccountsHomeComponent } from './user-accounts-home/user-accounts-home.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';

export const userAccountsPages: any[] = [
  RequestUserAccountsComponent,
  UserAccountsHomeComponent,
  PasswordRecoveryComponent,
  UsersDashboardComponent,
  CreateAccountDashboardComponent,
];
