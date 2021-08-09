import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/service/login-service.service';
import { SessionVar } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  /** Here is where we create a loginService of type LoginServiceService.
   * loginService will then have the ability to call any method that it
   * has inherited, such as checkSessionLogin() which returns a boolean
   */
  constructor(public loginService: LoginServiceService) { }

  ngOnInit(): void {
  }

  // Removes the login cookie
  logout(){
    sessionStorage.removeItem(SessionVar.loginKey);
  }
}
