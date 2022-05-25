import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardComponent } from './card/card.component';
import { Card2Component } from './card2/card2.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {path:'',component:CardComponent},
  {path:'create',component:Card2Component},
  {path:'map',component:MapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
