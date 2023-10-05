import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramsService } from 'src/app/core/services/programs.service';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['./programs-list.component.css'],
})
export class ProgramsListComponent implements OnInit {
  programsDetails$: Observable<any[]>;
  pageSize: number = 10;
  page: number = 1;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 25, 50, 100, 200];
  searchingText: string;
  currentProgram: any;
  showConfirmButtons: boolean = false;
  updating: boolean = false;
  reasonForCancellingRequest: string;
  currentOrgUnit: any;

  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  @Input() userSupportDataStoreKeys: any;

  @Output() dataStoreChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(private programsService: ProgramsService) {}

  ngOnInit(): void {
    this.getPrograms();
  }

  getPrograms(): void {
    this.programsDetails$ = this.programsService.getPrograms({
      page: this.page,
      pageSize: this.pageSize,
      searchingText: this.searchingText,
    });
  }

  searchProgram(event: any): void {
    this.searchingText = (event?.target as any)?.value;
    this.getPrograms();
  }

  getProgramsList(event: any): void {
    this.pageIndex = event.pageIndex;
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.getPrograms();
  }
}
