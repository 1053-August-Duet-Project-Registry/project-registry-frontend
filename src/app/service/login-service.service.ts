import { Injectable } from '@angular/core';
import { SessionVar } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  /** This method will get an item that was stored in a sessionStorage
   * when the user attemps to sign in. Please see the authenticate method for this
   */
  checkSessionLogin(){
    return Boolean(sessionStorage.getItem(SessionVar.loginKey));
  }
}
