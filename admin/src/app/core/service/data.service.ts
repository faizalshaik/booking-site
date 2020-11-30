import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from '../Config';
import {ApiResponse} from '../model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  _status = 0;
  _message = '';
  _api = 'bookings/';

  constructor(public _http: HttpClient) {
  }

  public get_bookings(token:string, date:string, users: number[], dura: number):Promise<any>{
    const body = JSON.stringify({token: token, date: date, users: users, dura: dura});
    const promise = this._http.post(Config._baseUrl + this._api + "get_bookings", body, { headers: Config.createRequestOptions() }).toPromise();

    if (promise == null) {
      return Promise.resolve(null);
    }
    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;
      
      if (res.status === 200) {
        return Promise.resolve(res.data);
      }
      return Promise.resolve(null);
    });
  }


  public get_booking_updates(token:string, date:string, users: number[], dura: number):Promise<any>{
    const body = JSON.stringify({token: token, date: date, users: users, dura: dura});
    const promise = this._http.post(Config._baseUrl + this._api + "get_booking_updates", body, { headers: Config.createRequestOptions() }).toPromise();

    if (promise == null) {
      return Promise.resolve(null);
    }
    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;
      
      if (res.status === 200) {
        return Promise.resolve(res.data);
      }
      return Promise.resolve(null);
    });
  }

  public acquire_lock(token:string, date:string, hour:number, mins:number, user:number, dura:number):Promise<any>{
    const body = JSON.stringify({token: token, date: date, hour:hour, mins:mins, user: user, dura:dura});
    const promise = this._http.post(Config._baseUrl + this._api + "acquire_lock", body, { headers: Config.createRequestOptions() }).toPromise();

    if (promise == null) {
      return Promise.resolve(null);
    }
    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;
      
      if (res.status === 200) {
        return Promise.resolve({state: true, msg: '', data: res.data});
      }else if(res.status === 402)
      {
        return Promise.resolve({state: false, msg: res.message, data: res.data});
      }
      return Promise.resolve(null);
    });
  }

  public release_lock(token:string, date:string, hour:number, mins:number, user:number, dura:number):Promise<boolean>{
    const body = JSON.stringify({token: token, date: date, hour:hour, mins:mins, user:user, dura:dura});
    const promise = this._http.post(Config._baseUrl + this._api + "release_lock", body, { headers: Config.createRequestOptions() }).toPromise();

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

  public make_book(token:string, date:string, hour:number, mins:number, comments:string, user:number, dura:number):Promise<any>{
    const body = JSON.stringify({token: token, date: date, hour:hour, mins:mins, comments:comments,user:user, dura:dura});
    const promise = this._http.post(Config._baseUrl + this._api + "make_book", body, { headers: Config.createRequestOptions() }).toPromise();

    if (promise == null) {
      return Promise.resolve(null);
    }
    return promise.then((obj) => {
      const res = obj as ApiResponse;
      this._status = res.status;
      this._message = res.message;
      
      if (res.status === 200) {
        return Promise.resolve(res.data);
      }
      return Promise.resolve(null);
    });
  }


}
