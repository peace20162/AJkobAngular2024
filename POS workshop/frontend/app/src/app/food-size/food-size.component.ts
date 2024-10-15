import { Component } from '@angular/core';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { HttpClient } from '@angular/common/http';
import config  from '../../config';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-food-size',
  standalone: true,
  imports: [PopUpComponent,FormsModule,RouterLink ],
  templateUrl: './food-size.component.html',
  styleUrl: './food-size.component.css'
})
export class FoodSizeComponent {
  
  constructor(private http:HttpClient){}
  foodTypes: any[] = [];
  foodSizes: any[]=[];
  id:number = 0;
  name:string = "";
  moneyAdded:number = 0;
  remark:string = "";
  foodTypeId:number = 0;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchFoodTypes();
    this.fetchData();
  }
  fetchFoodTypes(){
    this.http.get(config.apiServer+'/api/foodType/list')
    .subscribe((res:any)=>{
      this.foodTypes = res.data;
      this.foodTypeId = this.foodTypes[0].id;
    });
  }
  fetchData(){
    try{
      this.http.get(config.apiServer+'/api/foodSize/list')
      .subscribe((res:any)=>{
        this.foodSizes = res.data;
      });      

    }catch(error:any){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }
  save(){
    const payload = {
       name: this.name,
       moneyAdded: this.moneyAdded,
       remark: this.remark,
       id: this.id,
       foodTypeId: parseInt(this.foodTypeId.toString())
    };

    if(this.id > 0){
      this.http.put(config.apiServer+'/api/foodSize/update',payload)
      .subscribe((res:any)=>{
        this.fetchData();
      });
      Swal.fire({
        icon:'success',
        title: 'Success',
        text: 'Food Size updated successfully',
      })
    }else{
      this.http.post(config.apiServer+'/api/foodSize/create',payload)
      .subscribe((res:any)=>{
        this.fetchData();
        this.id = 0;
      });
      Swal.fire({
        icon:'success',
        title: 'Success',
        text: 'Food Size added successfully',
      })
    }
    
    document.getElementById('modalFoodSize_btnClose')?.click();
  }

  async remove(item: any) {
    try {
      const button = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        this.http
          .delete(config.apiServer + '/api/foodSize/remove/' + item.id)
          .subscribe((res: any) => {
            this.fetchData();
          });
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  edit(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.remark = item.remark;
    this.foodTypeId = item.foodTypeId;
    this.moneyAdded = item.moneyAdded;
  }
}
