import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import {UserInfo} from '../model/auth';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  // tslint:disable-next-line:variable-name
  constructor(public _local: LocalStorageService) {
  }

  setToken(token: string, expire: number) {
    this._local.set('token', token, expire, 's');
  }

  public getToken(): string {
    return this._local.get('token');
  }

  public getUser():UserInfo{

    let token = this.getToken();
    if(token==null || token=='') return null;

    let data = token.split('.');
    if(data.length!=2) return null;

    let json = atob(data[0]);
    let user = JSON.parse(json);
    if(user == null) return null;
    if(user.Id ==undefined) return null;

    return user;
  }
  clear()
  {
    this._local.clear();
  }


  setPrayer(prayer: string) {
    this._local.set('prayer', prayer, Date.now()+ 7200, 's');
  }

  clearPrayer()
  {
    this._local.remove('prayer');
  }

  setWhatisThis() {
    this._local.set('whatis', '1', Date.now()+ 7200, 's');
  }
  getWhatisThis()
  {
    let whatis = this._local.get('whatis');
    if(whatis==null || whatis=='0') 
      return false;

    return true;
  }

  clearWhatisThis() {
    this._local.set('whatis', '0', Date.now()+ 7200, 's');
  }

  
}
