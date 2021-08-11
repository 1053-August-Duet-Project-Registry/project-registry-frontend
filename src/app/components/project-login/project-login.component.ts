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

  userLogin: Login = {username : "", password:""};
  errMessage: String = "";
  mouseoverLogin ?: boolean;

  constructor(private route: Router,) { }


  ngOnInit(): void {
  }

  login() {
    this.route.navigate(['/viewProject'])
  }
  authenticate(){
    console.log(this.userLogin)
    if(this.userLogin.username == "revature" && this.userLogin.password == "revature"){
      sessionStorage.setItem(SessionVar.loginKey, JSON.stringify(this.userLogin))
      this.route.navigate(['/viewProject'])
    } else {
      this.errMessage = "Wrong Id and password. Please try again!"
    }
  }
  
}
// login():void{
// this.route.navigate([''])
