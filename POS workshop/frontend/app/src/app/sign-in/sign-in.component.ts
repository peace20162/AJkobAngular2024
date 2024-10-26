import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  token: string = '';
  username: string = '';
  password: string = '';

  constructor (private http: HttpClient) {
    
  };

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.token = localStorage.getItem('angular_token')!;
  }
  signIn(){
    if(this.username ==''|| this.password==''){
      Swal.fire({
        title: 'ตรวจสอบข้อมูล',
        text:'โปรดกรอก username หรือ password ด้วย',
        icon: 'error',
      })
    }else{
      const payload = {
        username: this.username,
        password: this.password
      }
      try {
        this.http.post('http://localhost:3000/api/user/signin',payload)
        .subscribe((res:any)=>{
          this.token = res.token
          localStorage.setItem('angular_token',this.token)
          localStorage.setItem('angular_username', res.name)
          localStorage.setItem('angular_id', res.id)
          location.reload()
        },
        (error:any)=>{
          Swal.fire({
            title: 'ตรวจสอบข้อมูล',
            text: 'username invalid',
            icon: 'error'
          })
        })
      } catch (error:any) {
        Swal.fire({
          title: 'ERROR',
          text: error.message,
          icon: 'error'
        })
      }
    }
  }
}
