import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reporting-tools',
    pathMatch: 'full',
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./pages/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'user-accounts',
    loadChildren: () =>
      import('./pages/user-accounts/user-accounts.module').then(
        (m) => m.UserAccountsModule
      ),
  },
  {
    path: 'reporting-tools',
    loadChildren: () =>
      import(
        './pages/reporting-tools-assignment/reporting-tools-assignment.module'
      ).then((m) => m.ReportingToolsAssignmentModule),
  },
  {
    path: 'validation-rules-request',
    loadChildren: () =>
      import('./pages/validation-rules/validation-rules.module').then(
        (m) => m.ValidationRulesRequestModule
      ),
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./pages/statistics/statistics.module').then(
        (m) => m.StatisticsModule
      ),
  },
  {
    path: 'alma-export',
    loadChildren: () =>
      import('./pages/alma-export/alma-export.module').then(
        (m) => m.ALMAExportModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'accountability',
    loadChildren: () =>
      import('./pages/accountability/accountability.module').then(
        (m) => m.AccountabilityModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class RoutingModule {}
