import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SqlViewDataComponent } from './containers/sql-view-data/sql-view-data.component';
import { StatisticsHomeComponent } from './containers/statistics-home/statistics-home.component';
const routes: Routes = [
  {
    path: '',
    component: StatisticsHomeComponent,
  },
  {
    path: 'view/:id',
    component: SqlViewDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
