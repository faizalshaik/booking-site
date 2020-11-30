export class Booking{
    mins: number = 0;
    state: number = 0;  // 0 -enabled, 1 => reserved, 2 => locked, 3 => disabled by system
    user: string='';
    msg: string='';
}

export class HourBooking{
    hour: number = 0;
    label: string = '';
    bookings: Booking[] = [];
}


export class DayBooking{
    date: string = '';
    hours: HourBooking[] = [];
    is_weekend: boolean = false;
    is_today: boolean = false;    
    fulled: boolean = false;
}