import { Component } from '@angular/core';
import { RouterModule,RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SignInComponent } from "./sign-in/sign-in.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,RouterOutlet, NavbarComponent, SidebarComponent, SignInComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  token: string | undefined = '';
  title: string = 'Angular POS 2024';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.token = localStorage.getItem('angular_token')!;
  }
}
