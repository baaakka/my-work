import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

export interface User{
  userName:string,
  phone:string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
   form = false

  arrow = faArrowRightFromBracket;

   token = ''

   name = ''

   surname = ''

   user = {
     userName:'',
     phone:''
   }
   constructor(private router: Router){}
   ngOnInit(): void {
    this.token = localStorage.getItem('token') || ""
    if(this.token){
      this.user = jwt_decode(this.token)
      this.name = this.user.userName.split('_')[0]
      this.surname = this.user.userName.split('_')[1]
      console.log(this.name,this.surname);
    }
    
   }

   logout(){
     localStorage.removeItem('token')
     
    this.router.navigate(['']);
   }
}
