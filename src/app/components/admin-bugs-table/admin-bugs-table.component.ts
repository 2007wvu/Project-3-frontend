import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
// import {merge, Observable, of as observableOf} from 'rxjs';
import {Observable} from 'rxjs';

import BugReport from '../../models/BugReport';
// import {MatExpansionModule} from '@angular/material/expansion';
// import { report } from 'process';
import Application from 'src/app/models/Application';
import {ApiServiceService} from '../../services/api-service.service';

@Component({
  selector: 'app-admin-bugs-table',
  templateUrl: './admin-bugs-table.component.html',
  styleUrls: ['./admin-bugs-table.component.css']
})
export class AdminBugsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<BugReport>;
  @Input() bugReports: BugReport[];
  obs: Observable<any>;
  dataSource: MatTableDataSource<BugReport> = new MatTableDataSource<BugReport>();


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'application', 'location', 'severity', 'priority', 'date', 'developer', 'details' ];
  constructor(private changeDetectorRef: ChangeDetectorRef, private apiservice: ApiServiceService) {
  }

  bugReportsByReporter:Array<BugReport>;

  bugReportByPriority:Array<BugReport>;

  bugReportBySeverity:Array<BugReport>;

  bugReportByApplication:Array<BugReport>;

  priority:string = "All";

  severity:string = "All";

  priorityNumber:number = 0;

  severityNumber:number = 0;

  apps:Array<Application>;

  reporterUsername:string;

  bugReportsDisplay:Array<BugReport>;

  priorityDisplay:string;

  severityDisplay:string;

  searchInput:string;

  sortingMap = new Map();

  selectedAppTitle:string = "All";

  ngOnInit() {
    this.populate(this.bugReports);
    this.bugReportsDisplay = this.bugReports;
    this.initializeSortMap();
    this.getApplications();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  populate(bugs:BugReport[]){
    this.dataSource = new MatTableDataSource<BugReport>(bugs);

    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;

    this.obs = this.dataSource.connect();

  }
  
  initializeSortMap(){
  //False will sort alphabetically and true will be unalphabetically
  this.sortingMap.set("title",false);
  this.sortingMap.set("application",false);
  this.sortingMap.set("location",false);
  this.sortingMap.set("developer",false);

  //False will sort from high to low and true will be the opposite
  this.sortingMap.set("severity",false);
  this.sortingMap.set("priority",false);

  this.sortingMap.set("date",false);
  }

  //Priority and Severity filters

  /**************************************************************************************************************
  When any of the filters are changed the following function calls occur.
  
                                                  filterByApplication()
                                                           |
                                                           |
                                                          \_/
                                                  setbugReportByPriority
                                                           |
                                                           |
                                                          \_/
                                                  setbugReportBySeverity
  
  **************************************************************************************************************/

  filterLowPriorityBugs(bugReport){
    return bugReport.priority == "Low"
  }

  filterMediumPriorityBugs(bugReport){
    return bugReport.priority == "Medium"
  }
    
  filterHighPriorityBugs(bugReport){
    return bugReport.priority == "High"
  }

  filterLowSeverityBugs(bugReport){
    return bugReport.severity == "Low"
  }

  filterMediumSeverityBugs(bugReport){
    return bugReport.severity == "Medium"
  }

  filterHighSeverityBugs(bugReport){
    return bugReport.severity == "High"
  }

  filterByApplication(){
    
    if(this.selectedAppTitle === "All"){
      this.bugReportsDisplay = this.bugReports;
    }else{
      this.bugReportsDisplay = this.bugReports.filter(bugReport => bugReport.app.title === this.selectedAppTitle);
    }
    this.setbugReportByPriority();
  }

  setbugReportByPriority(){
    if(this.priority == "Low"){
      this.bugReportsDisplay = this.bugReportsDisplay.filter(this.filterLowPriorityBugs);
    }
    else if(this.priority == "Medium"){
      this.bugReportsDisplay = this.bugReportsDisplay.filter(this.filterMediumPriorityBugs);
    }
    else if (this.priority == "High"){
      this.bugReportsDisplay = this.bugReportsDisplay.filter(this.filterHighPriorityBugs);
    }
    this.setbugReportBySeverity();
  }

  setbugReportBySeverity(){
    if (this.severity == "Low"){
      this.bugReportsDisplay = this.bugReportsDisplay.filter(this.filterLowSeverityBugs);
    }
    else if (this.severity == "Medium"){
      this.bugReportsDisplay = this.bugReportsDisplay.filter(this.filterMediumSeverityBugs);
    }
    else if (this.severity == "High"){
      this.bugReportsDisplay = this.bugReportsDisplay.filter(this.filterHighSeverityBugs);
    }
    this.populate(this.bugReportsDisplay);
  }

  async search(){
    let filteredReports: BugReport[] = [];

    if(this.searchInput !== ""){
      
      this.searchInput = this.searchInput.toLowerCase();

      for(let report of this.bugReportsDisplay){
          let dateString = new Date(report.createdTime);
          
          if(report.title.toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }else if(report.app.title.toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }else if(report.location.toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }else if(report.severity.toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }else if(report.priority.toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }else if(dateString.toDateString().toString().toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }else if(report.username.toLowerCase().includes(this.searchInput)){
            filteredReports.push(report);
          }
        }
        this.populate(filteredReports);
    }else{
      this.populate(this.bugReportsDisplay);
    }
  }
  
  async getApplications(){
    this.apps = await this.apiservice.getApplications();
    return this.apps;
  }
  
  sortColumn(column:string){
    this.bugReportsDisplay.sort(function(a,b){
      let statusA,statusB;
      switch (column) {
        case "title":
          statusA = a.title.toLowerCase();
          statusB = b.title.toLowerCase();
          break;
        case "application":
          statusA = a.app.title.toLowerCase();
          statusB = b.app.title.toLowerCase();
          break;
        case "location":
          statusA = a.location.toLowerCase();
          statusB = b.location.toLowerCase();
          break;
        case "developer":
          statusA = a.username.toLowerCase();
          statusB = b.username.toLowerCase();
          break;
        case "date":
          statusA = b.createdTime;
          statusB = a.createdTime;
          break;
        default:
          break;
      }
      return (statusA < statusB) ? -1 : (statusA > statusB) ? 1 : 0;
    })
    if(this.sortingMap.get(column)){
      this.bugReportsDisplay.reverse();
    }
    this.sortingMap.set(column,!this.sortingMap.get(column));
    this.populate(this.bugReportsDisplay);
  }

  sortPrioSev(column:string){
    this.bugReportsDisplay.sort(function(a,b){
      let statusA,statusB;
        if(column === "priority"){
          statusA = a.priority;
          statusB = b.priority;
          
        }else if (column ==="severity"){
          statusA = a.severity;
          statusB = b.severity;
        }
        statusA = (statusA==="High") ? 1 : (statusA==="Medium") ? 0 : -1;
        statusB = (statusB==="High") ? 1 : (statusB==="Medium") ? 0 : -1;
        return (statusA < statusB) ? 1 : (statusA > statusB) ? -1 : 0; 
      });
      if(this.sortingMap.get(column)){
        this.bugReportsDisplay.reverse();
      }
      this.sortingMap.set(column,!this.sortingMap.get(column));
      this.populate(this.bugReportsDisplay);
  }
}