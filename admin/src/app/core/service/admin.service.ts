import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from '../Config';
import {ApiResponse} from '../model';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  _status = 0;
  _message = '';
  _api = 'Admin_api/';

  constructor(public _http: HttpClient) {
  }

  public get_home_contents(token:string):Promise<any>{
    const body = JSON.stringify({token: token});
    const promise = this._http.post(Config._baseUrl + this._api + "get_home_contents", body, { headers: Config.createRequestOptions() }).toPromise();
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

  public put_home_contents(token:string, contents:any):Promise<boolean>{
    const body = JSON.stringify({token: token, contents:contents});
    const promise = this._http.post(Config._baseUrl + this._api + "put_home_contents", body, { headers: Config.createRequestOptions() }).toPromise();
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


  public get_users(token:string):Promise<any>{
    const body = JSON.stringify({token: token});
    const promise = this._http.post(Config._baseUrl + this._api + "get_users", body, { headers: Config.createRequestOptions() }).toPromise();
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

  public get_images(token:string):Promise<any>{
    const body = JSON.stringify({token: token});
    const promise = this._http.post(Config._baseUrl + this._api + "get_images", body, { headers: Config.createRequestOptions() }).toPromise();
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
  public put_image(token:string, image:string):Promise<any>{
    const body = JSON.stringify({token: token, image:image});
    const promise = this._http.post(Config._baseUrl + this._api + "put_image", body, { headers: Config.createRequestOptions() }).toPromise();
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

  public remove_image(token:string, id:number):Promise<boolean>{
    const body = JSON.stringify({token: token, Id:id});
    const promise = this._http.post(Config._baseUrl + this._api + "remove_image", body, { headers: Config.createRequestOptions() }).toPromise();
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

  public get_videos(token:string):Promise<any>{
    const body = JSON.stringify({token: token});
    const promise = this._http.post(Config._baseUrl + this._api + "get_videos", body, { headers: Config.createRequestOptions() }).toPromise();
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

  public add_new_video(token:string, link:string):Promise<any>{
    const body = JSON.stringify({token: token, link:link});
    const promise = this._http.post(Config._baseUrl + this._api + "add_new_video", body, { headers: Config.createRequestOptions() }).toPromise();
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
  
  public update_video(token:string, id:number, link:string):Promise<boolean>{
    const body = JSON.stringify({token: token,Id:id, link:link});
    const promise = this._http.post(Config._baseUrl + this._api + "update_video", body, { headers: Config.createRequestOptions() }).toPromise();
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

  public remove_video(token:string, id:number):Promise<boolean>{
    const body = JSON.stringify({token: token,Id:id});
    const promise = this._http.post(Config._baseUrl + this._api + "remove_video", body, { headers: Config.createRequestOptions() }).toPromise();
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
