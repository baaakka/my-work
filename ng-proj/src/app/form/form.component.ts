import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form!:FormGroup
  loginForm!:FormGroup

  sendLogin:boolean = true

  showRegiser:boolean = true

  token:string = ''

  phoneNumbers:any = []

  @Input() title  = "ahahha"
  @Output() close = new EventEmitter<void>()
  constructor(private http:HttpClient,private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null,[Validators.required]),
      surname: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required]),
      phonenumber: new FormControl(null,[Validators.required,Validators.minLength(10)]),
      password: new FormControl(null,[Validators.required])
    })

    this.loginForm = new FormGroup({
      email: new FormControl(null,[Validators.required]),
      password: new FormControl(null,[Validators.required])
    })

    this.http.get('https://localhost:5001/api/users')
    .subscribe((res:any) =>{
      for(let i of res){
        this.phoneNumbers.push(i.phoneNumber)
      }
    })
  }


  submit(){
    this.sendLogin = true
    for(let i of this.phoneNumbers){
      if(this.form.value.phonenumber == i){
        this.sendLogin = false
        break
      }
    }
    if(this.sendLogin){
      this.http.post('https://localhost:5001/api/auth/register',this.form.value)
      .subscribe( response => {
        localStorage.setItem('token', JSON.stringify(response))
        
        this.router.navigate(['']);
      })
    }
  }

  loginsubmit(){
    console.log(this.loginForm.value);
    
    this.http.post('https://localhost:5001/api/auth/login',this.loginForm.value)
    .subscribe(response =>{
      localStorage.setItem('token', JSON.stringify(response))
      this.router.navigate(['']);
    })
  }

  showLogin(){
    this.showRegiser = false
  }

  showRegister(){
    this.showRegiser = true
  }
}
