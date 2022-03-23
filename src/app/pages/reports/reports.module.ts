import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { reportsPages } from './pages';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [...reportsPages],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
