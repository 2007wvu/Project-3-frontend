import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ApiServiceService} from 'src/app/services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Client from 'src/app/models/Client';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  email:string;
  key:string;
  username:string;
  password = new FormControl('');
  confirmPassword = new FormControl('');
  client:Client;
  
  constructor(private router: Router,private activeRouter:ActivatedRoute, private api:ApiServiceService) { }

  submit(){
    if(this.password.value === this.confirmPassword.value){
      this.client.password = this.password.value;
      //reset password in db
      this.api.updatePassword(this.client);

      //send to login page
      // this.router.navigate([])
      
    }else{
      alert('Passwords do not match!')
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
    this.client = await this.api.verifyEmail(this.username, this.email,this.key);
    //return client with that email and key

    //or return null if does not match db
  }

}
