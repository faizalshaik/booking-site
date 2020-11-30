import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, WebsocketService, ReservationInfo, ReservationService } from 'src/app/core/service';
import { IMultiSelectSettings, IMultiSelectOption, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  providers: [WebsocketService, ReservationService]
})
export class BookingComponent implements OnInit {

  selected_date:string ='';
  selected_spot:any;
  selected_spot_user: string='';
  remain_time: number = 0;
  remain_time_str: string = '';

  calling_update:boolean = false;

  days: any[] = [];
  days_page:any;

  iday:number = 0;
  spot_rows : any[] = [];
  users : any[] = [];

  duration: number = 60;


  public usersControlModel: number[] = [];
  public usersControlSettings: IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'checkboxes',
      buttonClasses: 'btn btn-secondary btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  public usersControlOptions: IMultiSelectOption[] = [ ];  
  public usersControlTexts: IMultiSelectTexts = {
    checkAll: 'Select all users',
    uncheckAll: 'Unselect all users',
    checked: 'user selected',
    checkedPlural: 'users selected',
    searchPlaceholder: 'Find...',
    defaultTitle: 'Select users using search filter',
    allSelected: 'All selected',
  };  


  public modalRef: NgbModalRef;
  public form:FormGroup;
  constructor(public fb: FormBuilder, public modalService: NgbModal, 
              public dataService: DataService, public reservationService: ReservationService) 
  {     
    let svc = this;
    reservationService.infos.subscribe(info => {
      svc.updateSpot(info);
      // console.log(info);
    });
    
  }

  updateSpot(info)
  {    
    if(this.selected_date != info.date) return;
    // console.log(info);

    let start_min = info.hour * 60 + info.mins;
    let end_min = start_min + info.dura;


    this.spot_rows.forEach(row => {
      row.spots.forEach(spot => {
        if(spot.user == info.user)
        {
          let start_min1 = spot.hour * 60 + spot.mins;
          let end_min1 = start_min1 + spot.dura;

          if ((start_min >= start_min1 && start_min < end_min1) ||
            (end_min > start_min1 && end_min <= end_min1)) {
              spot.state = info.state;
          }
        }
      });
    });
  }

  refresh()
  {
    let svc = this;
    this.dataService.get_bookings('', this.selected_date, this.usersControlModel, this.duration).then(res => {
      if(res)
      { 
        svc.selected_date = res.date;
        svc.days = res.days; 
        svc.users = res.users; 
        svc.spot_rows = res.rows;
        svc.usersControlOptions = res.all_users;
      }
    });
  }


  updateStatus()
  {
    if(this.calling_update) return;

    this.calling_update = true;
    let svc = this;
    this.dataService.get_booking_updates('', this.selected_date, this.usersControlModel, this.duration).then(res => {
      if(res)
      { 
        if (res.date == svc.selected_date && 
          res.users.length == svc.usersControlModel.length &&
          res.dura == svc.duration)
        {
          for(let iRow=0; iRow<res.rows.length; iRow++)
          {
            for(let iCol = 0; iCol < res.rows[iRow].length; iCol++)
              svc.spot_rows[iRow].spots[iCol].state = res.rows[iRow][iCol];
          }
        }
      }
      svc.calling_update = false;
    });
  }


  onSelectDay(day)
  {
    this.selected_date = day.date;
    this.refresh();
  }


  ngOnInit() {
    this.form = this.fb.group({
      comments: [null, Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    this.refresh();

    let svc = this;
    // setInterval(() =>{
    //   svc.updateStatus();
    // }, 3000);

    setInterval(() =>{
      if(svc.remain_time > 0)
      {
        svc.remain_time --;        
        let min = Math.trunc(svc.remain_time / 60);
        svc.remain_time_str = min + ':' + (svc.remain_time % 60);
        if (svc.remain_time ==0)
          svc.closeModal();
      }

    }, 1000);
  }

  public onClickSpot(modalContent, spot) {

    if(spot.state !=0 ) return;
    let token = '';
    let svc = this;

    this.dataService.acquire_lock(token, this.selected_date, spot.hour, spot.mins, spot.user, spot.dura).then(res =>{
      if(res.state)
      {
        svc.selected_spot = spot;
        for(let i=0; i<svc.usersControlOptions.length; i++)
        {
          if(svc.usersControlOptions[i].id == spot.user)
          {
            svc.selected_spot_user = svc.usersControlOptions[i].name;
            break;
          }
        }
        svc.remain_time = 900;
        spot.state =2;
        svc.selected_spot = spot;
        svc.openModal(modalContent, spot);
      }
      else
      {
        console.log(res.msg);
      }
    });
  }

  openModal(modalContent, spot) {
    let token = '';
    let options: any = {
      size: "dialog-centered",
      // container: '.app'
    };
    this.modalRef = this.modalService.open(modalContent, options);    
    this.modalRef.result.then((result) => {
      this.form.reset();
    }, (reason) => {
      this.form.reset();
    });
  }

  public closeModal(){
    this.remain_time = 0;
    this.modalRef.close();    
    this.dataService.release_lock('', this.selected_date, this.selected_spot.hour, this.selected_spot.mins, this.selected_spot.user, this.selected_spot.dura).then(res =>{
      //update data
      this.selected_spot.state = 0;
    }); 
  }

  public makeBook(){
    this.remain_time = 0;
    this.modalRef.close();
    let comments = this.form.value.comments;
    let svc = this;
    this.dataService.make_book('', this.selected_date, this.selected_spot.hour, this.selected_spot.mins, comments, this.selected_spot.user, this.selected_spot.dura).then(res=>{
      if(res)
      {
        svc.selected_spot.msg = res.comments;
        svc.selected_spot.state = res.state;
      }
    });
  }

  onSelectUsers(event)
  {
    this.refresh(); 
  }

  onSelectDuration(){

    this.duration = Number(this.duration);
    this.refresh();
  }


}
