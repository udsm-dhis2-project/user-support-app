import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { reportsPages } from './pages';
import { SharedModule } from 'src/app/shared/shared.module';
import { reportsComponents } from './components';

@NgModule({
  declarations: [...reportsPages, ...reportsComponents],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
