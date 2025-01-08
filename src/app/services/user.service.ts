import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { User, UserRole } from '../models/commons.module';
import { Router } from '@angular/router';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userObject = signal<User | null>(null);
  _router = inject(Router);
  _constants = inject(ConstantsService)
  private _platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const userObjectLocalStorgae = localStorage.getItem("userObject");
      if(userObjectLocalStorgae) this.userObject.set(JSON.parse(userObjectLocalStorgae));
    }
  }

  saveNameLocalStorage = effect(() => {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem("userObject", JSON.stringify(this.userObject()));
    }
  });

  logout() {
    this.userObject.set(null);
    localStorage.removeItem('userObject');
    this._router.navigate(['/']);
    this.userObject();
  }

  getUserRole(): UserRole | null {
    return this.userObject()?.role || null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === UserRole.ADMIN;
  }

  /*isEditor(): boolean {
    return this.getUserRole() === UserRole.EDITOR;
  }

  isViewer(): boolean {
    return this.getUserRole() === UserRole.VIEWER;
  }*/

  isRegistered(): boolean {
    return this.getUserRole() === UserRole.REGISTERED;
  }

  onSwitchChange(service: string) {
    const currentUser = this.getUserObject();
    if(service == 'help'){
      this._constants.isHelpChecked = !this._constants.isHelpChecked;
      if(currentUser){
        const updatedUserObject = {
          ...currentUser,
          needHelp: this._constants.isHelpChecked
        };
        this.setUserObject(updatedUserObject);
      }
    }else if(service == 'sounds'){
      this._constants.isSoundsChecked = !this._constants.isSoundsChecked;
      if(currentUser){
        const updatedUserObject = {
          ...currentUser,
          needSounds: this._constants.isSoundsChecked
        };
        this.setUserObject(updatedUserObject);
      }
    }
    console.log('El interruptor está:', this._constants.isHelpChecked ? 'Activado' : 'Desactivado');
  }

  getUserObject(): User | null {
    return this.userObject();
  }

  setUserObject(user: User | null): void {
    this.userObject.set(user);
  }

  getNeedHelp(): boolean | undefined {
    return this.userObject()?.needHelp ?? false;
  }

}
