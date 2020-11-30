export class ApiResponse{
    status:number;
    message:string;
    data:any;
}

export class UserInfo{
    Id:number;
    name:string ='';
    email:string='';
    password:string='';    
    // first_name:string='';
    // last_name:string='';
    // country:string='';
    // state:string='';
    // city:string=''; 
    // address:string='';
  
    localtime:number;
    type:string="user";
}

export class AuthResult{
    token:string;
    expire:number;

    static userInfo(token:string):UserInfo
    {
        var data = token.split(".");
        if(data.length!=2) 
            return null;
        let jsonData = atob(data[0]);
        return JSON.parse(jsonData) as UserInfo;
    }
}

