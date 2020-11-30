import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { WebsocketService } from "./websocket.service";
import {Config} from "../Config"

export interface ReservationInfo {
  user: number;
  date: string;
  hour: number;
  mins: number;
  dura: number;
  state: number;
  comments: string;
}

@Injectable()
export class ReservationService {
  public infos: Subject<ReservationInfo>;

  constructor(public wsService: WebsocketService) {
    this.infos = <Subject<ReservationInfo>>wsService.connect(Config._wsUrl).map(
      (response: MessageEvent): ReservationInfo => {
        let data = JSON.parse(response.data);
        return {
            user: data.user,
            date: data.date,
            hour: data.hour,
            mins: data.mins,
            dura: data.dura,
            state: data.state,
            comments: data.comments
        };
      }
    );
  }
}