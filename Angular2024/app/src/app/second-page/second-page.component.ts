import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-second-page',
  standalone: true,
  imports: [],
  templateUrl: './second-page.component.html',
  styleUrl: './second-page.component.css'
})
export class SecondPageComponent {
  constructor(private http:HttpClient){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const payload = {
      id:100,
      name:`test`,
    }
    this.http
      .delete('https://fakerapi.it/api/v1/persons')
      .subscribe((res)=>{
        console.log(res);
      }
    );
  }
}
