import { Pipe, PipeTransform } from '@angular/core';
import { Publication } from './map/map.component';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(publications: Publication[], search:string = ''): any {
    if(!search.trim()){
      return publications
    }

    return publications.filter( publication =>{
      
      return publication.city.includes(search)
    })
  }

}
