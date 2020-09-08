import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Solution from 'src/app/models/Solution';
import BugReport from 'src/app/models/BugReport';
import Client from 'src/app/models/Client';
import { ActivatedRoute, Router } from '@angular/router';
import SolutionStatus from 'src/app/models/SolutionStatus';
import { MatTableDataSource } from '@angular/material/table';
import BugStatus from 'src/app/models/BugStatus';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-bug-report-view',
    templateUrl: './bug-report-view.component.html',
    styleUrls: ['./bug-report-view.component.css']
})
export class BugReportViewComponent implements OnInit {


    public brId: any;
    public solutions: Array<Solution>;
    public br = new BugReport();
    public client: Client;
    public SolDescription: string = '';
    public SolTitle: string = '';
    public priorityLevel = ['Low', 'Medium', 'High'];
    public severityLevel = ['Low', 'Medium', 'High'];
    public severity: string;
    public priority: string;
    @ViewChild('txtSolTitle') txtSolTitle: ElementRef;
    @ViewChild('txtSolDescribtion') txtSolDescribtion: ElementRef;
    displayedColumns: string[] = ['description'];
    dataSource: MatTableDataSource<Solution>;
    requested: boolean;
    isAdmin: boolean;
    currentSolution:Solution;



    constructor(private apiserv: ApiServiceService, private route: ActivatedRoute, private router: Router, private _snackBar:MatSnackBar) {
        this.getClient();
        if (this.client == null || this.client === undefined) {
            this.router.navigate(["/"]);
        } else {
            this.brId = this.route.snapshot.paramMap.get("id");
            this.getBugReportById();
            this.getBugSolutionsById();
        }

    }

    ngOnInit(): void {

    }
    //0. Get Client By ID
    getClient(): Client {
        this.client = this.apiserv.getLoggedClient();
        this.isAdmin = this.client.role ? true : false;
        /// console.log(this.client);
        return this.client;
    }
    //1. Get Bug Report By ID 
    async getBugReportById(): Promise<BugReport> {
        this.br = await this.apiserv.getBugReportById(this.brId);
        this.requested = this.br.status === "Requested" ? true : false;
        //console.log(this.br.solutions);
        //  console.log(this.br);
        return this.br;
    }
    //2. Get all Solutions  by Bug Report ID 
    async getBugSolutionsById(): Promise<Array<Solution>> {
        this.solutions = await this.apiserv.getSolutionsByBugId(this.brId);
        this.solutions.sort(function(a,b){
            let statusA = a.status.toLowerCase();
            let statusB = b.status.toLowerCase();
            return (statusA < statusB) ? -1 : (statusA > statusB) ? 1 : 0;
        })
        this.dataSource = new MatTableDataSource(this.solutions);
        return this.solutions;
    }
    //3. Add new  Solution
    async postSolution(): Promise<any> {
        let isvalid: boolean = true;
        if (this.txtSolTitle.nativeElement.value.trim().length === 0) {
            this.txtSolTitle.nativeElement.focus();
            isvalid = false;
            return;
        }
        if (this.txtSolDescribtion.nativeElement.value.trim().length === 0) {
            this.txtSolDescribtion.nativeElement.focus();
            isvalid = false;
            return;
        }
        if (isvalid) {
            let sol = new Solution();
            sol.br = this.br;

            sol.client = this.client;
            sol.id = 0;
            sol.status = SolutionStatus.pending;
            sol.title = this.SolTitle;
            sol.description = this.SolDescription;
            sol.timeSubmitted = new Date().getTime();

            let result = await this.apiserv.postSolution(sol);
            this.getBugSolutionsById();
            return result;
        }

    }
    //4. Reject Bug report
    async RejectBug() {
        this.br.status = BugStatus.denied;
        this.br.pointValue = 0;
        const bugReport: BugReport = await this.apiserv.putBugReport(this.br);
        this.br = bugReport;
    }
    //5. Accept Bug report
    async AcceptBug() {
        this.br.status = BugStatus.unresolved;
        const bugReport: BugReport = await this.apiserv.putBugReport(this.br);
        this.br = bugReport;
    }
    setSeverity(event) {
        this.severity = event.target.value;

    }
    setPriority(event) {
        this.priority = event.target.value;
    }
    async closeBug(){
        this.br.resolvedTime = new Date().getTime()
        this.br.status = BugStatus.resolved;
        this.br.dateCreated = this.br.createdTime;
        console.log(this.br);
        const bugReport: BugReport = await this.apiserv.putBugReport(this.br);
        this.br = bugReport;
        console.log(this.br);
    }
    async updateSolution(solution:Solution) {
        await this.apiserv.putSolution(solution)
        this.openSnackBar(`Solution is ${solution.status}!`,"");
    }
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 4000,
        });

    }

}
