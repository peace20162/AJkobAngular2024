import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  name: string = '';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.name = localStorage.getItem('angular_username')!;
  }

  async signOut() {
    const button = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    });

    if(button.isConfirmed) {
      localStorage.removeItem('angular_token');
      localStorage.removeItem('angular_username');
      location.reload();
    }
  }
}
