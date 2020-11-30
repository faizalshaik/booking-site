import { HttpHeaders} from '@angular/common/http';
export class Config{

    static _wsUrl:string = "ws://localhost:50000";
    //static _baseUrl:string = "//booking.viaom.com/backend/";
    // static _baseUrl:string = "//localhost/booking/";
    static _baseUrl:string = "//localhost:5000/";
    static createRequestOptions() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return headers;
      }
}

