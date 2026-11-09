import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar,IconDefinition,faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarEmpty} from '@fortawesome/free-regular-svg-icons'
@Component({
  selector: 'app-ratings',
  imports: [FontAwesomeModule],
  templateUrl: './ratings.html',
  styleUrl: './ratings.css'
})
export class Ratings {
//input signal is same as input decorator(writeable signal)
score=input<number>(0);  //3,3.5,4,4.6

faStar=faStar;
faStarHalfStroke=faStarHalfStroke;
faStarEmpty=faStarEmpty

//compute signal for stars (readable signal)
stars=computed(()=>{
  const value=Math.min(this.score(),5);
  const icons:IconDefinition[]=[]  //special type of object that come from fontawsome library,it describe the structure of the icon like full star or half star or empty star
  const solid=Math.floor(value)  //3,4,5  (full start)
  const half=value-solid>=0.5
  
  //pushh full start in then icons array
  for(let i=0;i<solid;i++){
    icons.push(this.faStar);
  }
  //push half start in icons array
  if(half){
    icons.push(this.faStarHalfStroke);
  }
  //push empty starts in an icons array
  while(icons.length<5){
    icons.push(this.faStarEmpty)
  }
  return [...icons]

})

}
