import { Component, OnInit, Input } from '@angular/core';
import BugReport from '../../models/BugReport';
import {ApiServiceService} from '../../services/api-service.service';
import Application from 'src/app/models/Application';

@Component({
  selector: 'app-admin-bugs',
  templateUrl: './admin-bugs.component.html',
  styleUrls: ['./admin-bugs.component.css']
})

export class AdminBugsComponent implements OnInit {
  @Input() typeOfReport: string;

  bugReports: Array<BugReport>;

  apps:Array<Application>;

  reporterUsername:string;

  bugReportsByReporter:Array<BugReport>;

  bugReportByPriority:Array<BugReport>;

  bugReportBySeverity:Array<BugReport>;

  priority:string;

  severity:string

  public show = false;

  tableId:string;

  public buttonName: any = 'Table View';
  shown = false;

  constructor(private apiservice: ApiServiceService) { }

  ngOnInit(): void {
    this.getBugReports();
    this.getApplications();
    
    
  }

  toggle() {
    this.show = !this.show;
    this.shown = !this.shown;

    // CHANGE THE NAME OF THE BUTTON
    if (this.show) {
      this.buttonName = 'Card View';
    }
    else {
      this.buttonName = 'Table View';
    }
  }

  async getBugReports(){
    switch (this.typeOfReport) {
      case "Resolved":
        this.bugReports = await this.apiservice.getResolvedBugs();
        this.tableId = "resolvedBugsTable";
        break;
      case "Unresolved":
        this.bugReports = await this.apiservice.getUnResolvedBugs();
        this.tableId = "unresolvedBugsTable";
        break;
      case "Requested":
        this.bugReports = await this.apiservice.getRequestedBugs();
        this.tableId = "adminBugsTable";
        break;
      default:
        break;
    }
    return this.bugReports;
  }

  async getApplications(){
    this.apps = await this.apiservice.getApplications();
    return this.apps;
  }

  async getbugReportByClientUsername(){
    this.bugReportsByReporter = await this.apiservice.getbugReportByClientUsername(this.reporterUsername);
    console.log(this.bugReportsByReporter);
    return this.bugReportsByReporter;
  }

  //Priority and Severity filters

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
    return bugReport.priority == "Medium"
  }

  filterHighSeverityBugs(bugReport){
    return bugReport.priority == "High"
  }

  // to get the bug reports by sevrity and priority

  getbugReportByPriority(){
    if(this.priority == "Low"){
      this.bugReportByPriority = this.bugReports.filter(this.filterLowPriorityBugs);
    }
    else if(this.priority == "Medium"){
      this.bugReportByPriority = this.bugReports.filter(this.filterMediumPriorityBugs);
    }
    else if (this.priority == "High"){
      this.bugReportByPriority = this.bugReports.filter(this.filterHighPriorityBugs);
    }
    else if(this.priority == "All"){
      this.bugReportByPriority = this.bugReports;
    }
    console.log(this.bugReportByPriority);
  }

  getbugReportBySeverity(){
    if (this.severity == "Low"){
      this.bugReportBySeverity = this.bugReports.filter(this.filterLowSeverityBugs);
    }
    else if (this.severity == "Medium"){
      this.bugReportBySeverity = this.bugReports.filter(this.filterMediumSeverityBugs);
    }
    else if (this.severity == "High"){
      this.bugReportBySeverity = this.bugReports.filter(this.filterHighSeverityBugs);
    }
    else if(this.severity == "All"){
      this.bugReportBySeverity = this.bugReports;
    }
  }

}
