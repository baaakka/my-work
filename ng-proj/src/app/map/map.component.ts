import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, from, map, mergeMap, Subscription, switchMap, tap } from 'rxjs';
import { faCircleQuestion,faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';

export interface Coords {
  lat: number,
  lng: number
}

export interface Formatted {
  geometry: Coords
}

export interface Response {
  results: Array<Formatted>
}

export interface ListOfPublication {
  _listOfPublications: Array<Publication>
}

export interface Publication {
  id: number,
  address: string,
  amount: number,
  city: string,
  comment: string,
  phone: string,
  price: string,
  timeRange: string,
  lng?: any,
  lat?: any
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription = new Subscription();

  question = faCircleQuestion
  
  lat = 50.4143434731116;
  lng = 30.5228363183;
  zoom = 8;
  showTool = false
  lng1 = 0;
  lat1 = 0;
  searchglass = faMagnifyingGlassLocation;
  token = ''

  user = {
    phone:''
  }


  dlng = 0;
  dlat = 0;

  a = 0;
  c = 0;
  r = 6371;
  public showInfo:boolean = true

  fromCity = ''

  kilometers = ''

  search = ''

  amount_search = ''

  public res: boolean = false;

  public compiler:boolean = false

  constructor(private http: HttpClient) { }

  savedPublications:any = []

  public publications: Publication[] = []

  ngOnInit() {
    this._subscriptions.add(
      this.http.get<ListOfPublication>('https://localhost:5001/api/auth/GetPublications')
        .pipe(
          mergeMap( response =>{
            this.publications = response._listOfPublications
            return forkJoin( this.publications.map((item) => this.http.get<Response>(`https://api.opencagedata.com/geocode/v1/json?q=" + ${item.city} + ${item.address} "+"&key=7e61181ee0b046dd93a3ef5e14071d68`)))
          })
          // switchMap( response =>{
          //   this.publications = response._listOfPublications
          //     return from(response._listOfPublications)
          //     .pipe(
          //       switchMap(response =>{
          //         console.log(response);
                  
          //         return this.http.get<Response>(`https://api.opencagedata.com/geocode/v1/json?q=" + ${response.city} + ${response.address} "+"&key=7e61181ee0b046dd93a3ef5e14071d68`)
          //       })
          //     )
          // })
        )
        .subscribe(response =>{
          
          for(let i = 0;i<this.publications.length;i++){
            this.publications[i].lat = response[i].results[0].geometry.lat
            this.publications[i].lng = response[i].results[0].geometry.lng
            
            this.res = true
          }
          console.log(this.publications);

          
        })
        
        //   // map(value => value),
        //   // switchMap((response: ListOfPublication) => {
        //   //   this.publications = response._listOfPublications
        //   //   return this.http.get<Response>(`https://api.opencagedata.com/geocode/v1/json?q=" + ${this.publications[2].city} + ${this.publications[2].address} "+"&key=7e61181ee0b046dd93a3ef5e14071d68`)
        //   // })
        // .subscribe(response => {
        //   console.log('123', response);
        //   // this.lng = response.results[0].geometry.lng
        //   // this.lat = response.results[0].geometry.lat
        //   this.publications = response._listOfPublications
        //   this.compiler = true
        //   // this.res.push(response);
          
        // })
        
    );
    this.token = localStorage.getItem('token') || ""
    if(this.token){
      this.user = jwt_decode(this.token)
    }
  }
  

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  klicked(){
    console.log('gege');
    
  }

  clicked():any{
    if(this.search == '' && this.publications.length <= this.savedPublications.length){
      this.publications = this.savedPublications[0]
    }
    this.savedPublications.push(this.publications.slice(0))
    this.publications = this.publications.filter( publication =>{
      
      return publication.city.includes(this.search)
    })

    if(this.amount_search){
      this.publications = this.publications.filter( publication =>{
      
        return publication.amount>= +this.amount_search
      })
    }
    
    if(this.kilometers && this.fromCity){
      this.http.get<Response>(`https://api.opencagedata.com/geocode/v1/json?q=" + ${this.fromCity} "+"&key=7e61181ee0b046dd93a3ef5e14071d68`)
      .subscribe(response =>{
        this.lat1 = (response.results[0].geometry.lat)* Math.PI / 180;
        this.lng1 = (response.results[0].geometry.lng)* Math.PI / 180;
          this.publications = this.publications.filter( publication =>{
            this.dlng = (publication.lng)* Math.PI / 180 - this.lng1
            this.dlat = (publication.lat)* Math.PI / 180 - this.lat1 
            this.a = Math.pow(Math.sin(this.dlat / 2), 2)
            + Math.cos(this.lat) * Math.cos(this.lat1)
            * Math.pow(Math.sin(this.dlng / 2),2);
            this.c =1.609344 * 2 * Math.asin(Math.sqrt(this.a))
            
            return (this.c * this.r )>= +this.kilometers
          })
      })
    }
  }

  scroll(el:HTMLElement,latitude : number,longitude:number){
    el.scrollIntoView({behavior: 'smooth'})
    this.lat = latitude
    this.lng = longitude
    this.zoom = 13
  }

  deletepubl(id:any){
    
    this.publications = this.publications.filter( publication =>{
      return publication.id!=id
    })
    this.http.delete('https://localhost:5001/api/auth/DeletePublication/'+id)
    .subscribe(response =>{
      console.log(response);
      
    })
  }
}
