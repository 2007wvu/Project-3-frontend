import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { ApiServiceService } from 'src/app/services/api-service.service';
// import {Application} from '../../models/Application'


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  /* @Input("app")application: Application; */
  @ViewChild('titlErr') x: ElementRef;
  @ViewChild('linkErr') y: ElementRef;
  public client: Client;
  
  constructor(private router: Router, private api: ApiServiceService) {
    
    this.getClient();
    if (this.client == null || this.client === undefined || this.client.role != 1) 
    this.router.navigate(["/"]);
    
  }
  
  
  ngOnInit(): void {
    
  }
  
  getClient(): Client {
    this.client = this.api.getLoggedClient();
    return this.client;
  }
  
  app:any
  appTitle:string
  appLink:string
  
  clear(){
    this.appTitle = undefined
    this.appLink = undefined
    this.x.nativeElement.innerHTML = '';
    this.y.nativeElement.innerHTML = '';
  }
  
  async addApplication(){
    if(this.appTitle == undefined) 
      this.x.nativeElement.innerHTML = 'Application Title is required!';
    else 
      this.x.nativeElement.innerHTML = '';
    
    if(this.appLink == undefined) 
      this.y.nativeElement.innerHTML = 'Application Github Link is required!';
    else 
      this.y.nativeElement.innerHTML = '';
    if(this.appTitle != undefined && this.appLink != undefined){
      this.app = await this.api.postApplication(this.appTitle,this.appLink)
      this.clear()
      if(this.app)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/applications'])}
        );
      }
    }
    
    
  }
  
  