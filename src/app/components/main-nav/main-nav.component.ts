import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Client from 'src/app/models/Client';

enum ClientRole {
  unregistered,
  developer,
  admin
}

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})

export class MainNavComponent {

  clientRole: ClientRole;
  client: Client;
  theme = 'Light Mode';
  show = true;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private serv: ApiServiceService) {
    this.client = this.serv.getLoggedClient();
    if (!this.client) {
      this.clientRole = ClientRole.unregistered;
    } else {
      this.clientRole = this.client.role ? ClientRole.admin : ClientRole.developer;
    }
  }

  ngOnInit(): void {
    document.body.classList.add('light-theme');
  }


  logout()
  {
    this.clientRole = ClientRole.unregistered;
    this.serv.clearLoggedClient();
    this.router.navigate(['/']);
  }

  changeTheme(){
    if (document.body.classList.contains('light-theme')){
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      this.theme = 'Dark Mode';
      this.serv.theme.emit("dark-theme");
    }
    else {
      
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      this.theme = 'Light Mode';
      this.serv.theme.emit("light-theme");
    }
    

  }
  showNav(){
    this.show = true;
    this.show = !this.show;
  }

}
