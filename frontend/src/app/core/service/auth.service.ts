import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from '../Config';
import {AuthResult, ApiResponse, UserInfo} from '../../core/model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _status = 0;
  _message = '';
  _api = 'Auth_api/';

  constructor(public _http: HttpClient) {
  }

  public login(email: string, pass: string): Promise<AuthResult> {
    const body = JSON.stringify({email: email, password: pass, localtime: Date.now()});
    const promise = this._http.post(Config._baseUrl + this._api + "login", body, { headers: Config.createRequestOptions() }).toPromise();
    if (promise == null) {
      return Promise.resolve(null);
    }

    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;

      if (res.status === 200) {
          const v = res.data as AuthResult;
          return Promise.resolve(v);
      }
      return Promise.resolve(null);
    });
  }

  public register(user:UserInfo): Promise<AuthResult>{
    user.localtime = Date.now();
    const body = JSON.stringify(user);
    const promise = this._http.post(Config._baseUrl + this._api + "register", body, { headers: Config.createRequestOptions() }).toPromise();
    if (promise == null) {
      return Promise.resolve(null);
    }

    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;

      if (res.status === 200) {
          const v = res.data as AuthResult;
          return Promise.resolve(v);
      }
      return Promise.resolve(null);
    });

  }

  public register_b(user:UserInfo): Promise<AuthResult>{
    user.localtime = Date.now();
    const body = JSON.stringify(user);
    const promise = this._http.post(Config._baseUrl + this._api + "register_b", body, { headers: Config.createRequestOptions() }).toPromise();
    if (promise == null) {
      return Promise.resolve(null);
    }

    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;

      if (res.status === 200) {
          const v = res.data as AuthResult;
          return Promise.resolve(v);
      }
      return Promise.resolve(null);
    });

  }

  public contactus(data:any):Promise<boolean>{
    const body = JSON.stringify(data);
    const promise = this._http.post(Config._baseUrl + this._api + "contactus", body, { headers: Config.createRequestOptions() }).toPromise();
    if (promise == null) {
      return Promise.resolve(false);
    }

    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;

      if (res.status === 200) {
          return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }
  

  public recoverpassword(email:string):Promise<boolean>{
    const body = JSON.stringify({email:email});
    const promise = this._http.post(Config._baseUrl + this._api + "recoverpassword", body, { headers: Config.createRequestOptions() }).toPromise();
    if (promise == null) {
      return Promise.resolve(false);
    }

    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;

      if (res.status === 200) {
          return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }

  public resetpassword(data:any):Promise<boolean>{
    const body = JSON.stringify(data);
    const promise = this._http.post(Config._baseUrl + this._api + "resetpassword", body, { headers: Config.createRequestOptions() }).toPromise();
    if (promise == null) {
      return Promise.resolve(false);
    }

    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;

      if (res.status === 200) {
          return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }

}
