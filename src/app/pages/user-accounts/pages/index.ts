import { CreateAccountDashboardComponent } from './create-account-dashboard/create-account-dashboard.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { UserAccountsHomeComponent } from './user-accounts-home/user-accounts-home.component';
import { UserAccountsRequestDashboardComponent } from './user-accounts-request-dashboard/user-accounts-request-dashboard.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';

export const userAccountsPages: any[] = [
  UserAccountsHomeComponent,
  PasswordRecoveryComponent,
  UsersDashboardComponent,
  CreateAccountDashboardComponent,
  UserAccountsRequestDashboardComponent,
];
