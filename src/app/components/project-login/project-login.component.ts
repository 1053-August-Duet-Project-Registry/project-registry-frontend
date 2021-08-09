import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login.model';
import { SessionVar} from 'src/environments/environment';

@Component({
  selector: 'app-project-login',
  templateUrl: './project-login.component.html',
  styleUrls: ['./project-login.component.css']
})
export class ProjectLoginComponent implements OnInit {

  /*Login is a model with attributes username and password*/
  userLogin: Login = {username : '', password: ''};
  errMessage = '';
  mouseoverLogin ?: boolean;

  constructor(private route: Router, ) { }

  ngOnInit(): void {
  }

  login() {
    this.route.navigate(['/viewProject']);
  }

  /* Method that validates the user credentials and will
  navigate to viewProject or display an error message. */
  authenticate(){
    if (this.userLogin.username === 'revature' && this.userLogin.password === 'revature'){
      /** Debugging */
      console.log('This is the sessionVar.loginKey: ' + SessionVar.loginKey);
      console.log('This is the userLogin on its own: ' + this.userLogin);
      console.log('This is the userLogin converted to JSON: ' + JSON.stringify(this.userLogin));

      /* This is what is being passed to key, and then value in line 39:
       * sessionStorage.setItem(userLogin, {"username":"revature", "password:revature"});
       * So, the key is userLogin
       * And the value is the JSON string
      */
      sessionStorage.setItem(SessionVar.loginKey, JSON.stringify(this.userLogin));
      this.route.navigate(['/viewProject']);

    } else {
      this.errMessage = 'Wrong Id and password. Please try again!';
    }
  }

}

