import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-first-page',
  standalone: true,
  imports: [],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.css'
})
export class FirstPageComponent {
  id : Number = 0;
  constructor(private route:ActivatedRoute){}

  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.paramMap.subscribe((params: ParamMap)=>{
      this.id = Number(params.get('id'))
    })
    
  }

}
