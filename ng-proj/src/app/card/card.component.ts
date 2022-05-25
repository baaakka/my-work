import { HttpClient } from "@angular/common/http";
import {Component} from "@angular/core"

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"]
})


export class CardComponent {

    constructor( private http : HttpClient){

    }


    ngOnInit(){
        this.http.get('https://localhost:5001/api/auth/GetPublications')
    .subscribe( response => {
      console.log(response);
      
    })
    }
}