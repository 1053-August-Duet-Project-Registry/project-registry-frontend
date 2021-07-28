import { Injectable } from '@angular/core';
import { SessionVar } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  checkSessionLogin(){
    return Boolean(sessionStorage.getItem(SessionVar.loginKey));
  }
}
