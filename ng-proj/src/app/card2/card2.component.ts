import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface Newform{
  amount:number,
  phone:string,
  city:string,
  adress:string,
  timerange:string,
  price:string,
  comment:string
}

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss']
})
export class Card2Component implements OnInit {
  
  form!:FormGroup

  constructor(private http:HttpClient){ }





  ngOnInit(): void {
    this.form = new FormGroup({
      amount: new FormControl(null,[Validators.required]),
      phone: new FormControl(null,[Validators.required,Validators.minLength(10)]),
      city: new FormControl(null,[Validators.required]),
      address: new FormControl(null,[Validators.required]),
      timerange: new FormControl(null,[Validators.required]),
      price: new FormControl(null,[Validators.required]),
      comment:new FormControl(null,[Validators.required]),
    })
  }

  submit(){
    this.http.post('https://localhost:5001/api/auth/CreatePublication',this.form.value)
    .subscribe( response => {
      console.log(response);
      
    })
  }

}
