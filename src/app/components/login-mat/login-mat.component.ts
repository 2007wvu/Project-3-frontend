import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import Client from '../../models/Client';
import {ApiServiceService} from '../../services/api-service.service';
import Solution from '../../models/Solution';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-mat',
  templateUrl: './login-mat.component.html',
  styleUrls: ['./login-mat.component.scss']
})
export class LoginMatComponent implements OnInit {

  constructor(private serv: ApiServiceService, private http: HttpClient,private _snackBar:MatSnackBar) { }

  client = new Client();

  @ViewChild('email') email: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('firstname') firstname: ElementRef;
  @ViewChild('lastname') lastname: ElementRef;
  @ViewChild('username') username: ElementRef;
  @ViewChild('regUsername') regusername: ElementRef;
  @ViewChild('regPassword') regpassword: ElementRef;
  @ViewChild('rePassword') repassword: ElementRef;

  showSpinner: boolean;
  toggle = false;
  status = 'Enable';
  invalid: boolean;
  shown = true;
  resetPasswordModal:boolean = false;
  resetPasswordEmail = new FormControl('');
  resetPasswordConfirmEmail = new FormControl('');
  resetPasswordUsername = new FormControl('');
  wrongEmail:boolean;

  ngOnInit(): void {
  }


  async clientLogin()  {
    const username = this.username.nativeElement.value;
    const pass = this.password.nativeElement.value;
    this.client = await this.serv.clientLogin(username, pass);
    if (this.client != null && this.client.cId > 0) {
        this.invalid = false;
        this.serv.setLoggedClient(this.client);
        this.showSpinner = true;
        setTimeout(() => {
          window.location.href = '/main';
        }, 1000);
        this.enableDisableRule();
      }

    else {
      this.invalid = true;
    }

  }

  enableDisableRule() {
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }


  async clientRegister(): Promise<Client> {
    let newclient = new Client();
    const solutions: Array<Solution> = [];
    newclient.cId = 0;
    newclient.email = this.email.nativeElement.value;
    newclient.fName = this.firstname.nativeElement.value;
    newclient.lName = this.lastname.nativeElement.value;
    newclient.username = this.regusername.nativeElement.value;
    newclient.password = this.regpassword.nativeElement.value;
    newclient.solutions = solutions;
    newclient.role = 0;

    newclient = await this.serv.clientRegister(newclient);
    if (newclient != null && newclient.cId > 0) {
        window.location.href = '/';
      }

    return newclient;

  }

  hideError() {
  this.shown = false;
  this.invalid = false;
  }

  openResetPassModal(){
    this.resetPasswordModal = true;
  }

  closeResetPasswordModal(){
    this.resetPasswordModal = false;
  }

  async resetPassword(){
    if(this.resetPasswordEmail.value !== this.resetPasswordConfirmEmail.value){
      alert("Emails do not match!")
      return;
    }

    const tempClient:Client[] = await this.http.get<Array<Client>>(`http://localhost:9111/clients?username=${this.resetPasswordUsername.value}`).toPromise();
    if(tempClient === null){
      alert("Information is not valid!")
      this.wrongEmail = true;
      return;
    }

    console.log(tempClient);
    
    const status = await this.serv.resetPassword(this.resetPasswordEmail.value,this.resetPasswordUsername.value);  
    console.log(status);
    
    if(status > 199 && status < 400){
      this.openSnackBar(`Email was sent succesfully!`,"");
    }else{
      alert("Email failed to send!")
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
}

}
