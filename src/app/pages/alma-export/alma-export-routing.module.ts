import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlmaExportHomeComponent } from './containers/alma-export-home/alma-export-home.component';
const routes: Routes = [
  {
    path: '',
    component: AlmaExportHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ALMAExportRoutingModule {}
