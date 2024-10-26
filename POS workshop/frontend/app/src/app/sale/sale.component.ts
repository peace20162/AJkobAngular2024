import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
  constructor(private http:HttpClient){}
  foods:any[] = [];
  serverPath:string = '';
  tableNo:number = 1;
  userId: number = 0;
  ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
    this.fetchData();
    this.serverPath= config.apiServer;
    const userId = localStorage.getItem('angular_id');
    this.userId = userId? parseInt(userId) : 0;
  }
  fetchData(){
    try {
      this.http.get(config.apiServer+'/api/food/list')
       .subscribe((res:any)=>{
          this.foods = res.data;
        });    
    }catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }
  filterFoodType(foodType: string){
    try {
      this.http.get(config.apiServer+'/api/food/filter/'+ foodType)
              .subscribe((res:any)=>{
              this.foods = res.data;
        });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }
  
  saveToSaleTemp(item: any) {
    try {
      const userId = localStorage.getItem('angular_id');
      const payload = {
        quantity: 1,
        tableNo: this.tableNo,
        foodId: item.id,
        userId: userId? parseInt(userId) : 0,
      }
      this.http.post(config.apiServer+'/api/saleTemp/create', payload)
              .subscribe(
                 (res:any) => {
                  this.fetchData();
                  Swal.fire({
                    icon:'success',
                    title: 'Item added to sale',
                    text: 'Item added to sale',
                  })
                 }
              )

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }  
  }
}
