import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ApiServiceService} from 'src/app/services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Client from 'src/app/models/Client';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  email:string;
  key:string;
  private username:string;
  password = new FormControl('');
  confirmPassword = new FormControl('');
  client:Client;
  passwordsMatch:boolean = false;
  
  constructor(private router: Router,private activeRouter:ActivatedRoute, private api:ApiServiceService) { }

  submit(){
    this.passwordsMatch = this.password.value === this.confirmPassword.value;
    if(this.passwordsMatch){
      this.client.password = this.password.value;
      //reset password in database
      this.api.updatePassword(this.client);
      
      alert("Password has been reset successfully!")
      //send to login page
      localStorage.removeItem("clientResetPassword");
      this.router.navigate(['']);
      
    }else{
      alert("Passwords do not match!")
      this.password.reset();
      this.confirmPassword.reset();
    }
  }

  ngOnInit(): void {

    this.activeRouter.queryParams.subscribe(params =>{
      this.username = params.username;
      this.email = params.email;
      this.key = params.key;

    });
    this.checkKeyAndEmail();
  }

  async checkKeyAndEmail(){
    if(localStorage.getItem("clientResetPassword") === null){
      this.client = await this.api.verifyAccount(this.username, this.email,this.key);
      localStorage.setItem("clientResetPassword",JSON.stringify(this.client));
    }
    else{
      this.client = JSON.parse(localStorage.getItem("clientResetPassword"));
    }
    if(this.client === null){
      alert("This is an invalid link.")
      this.router.navigate([""]);
    }
  }

}
