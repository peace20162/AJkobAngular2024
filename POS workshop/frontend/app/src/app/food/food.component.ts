import { Component } from '@angular/core';
import { PopUpComponent } from "../pop-up/pop-up.component";
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [PopUpComponent,FormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {
  

  constructor(private http: HttpClient){}
  foodTypes: any[] = [];
  foodSizes: any[]=[];
  name: string = "";
  remark:string = "";
  price:number = 0;
  foodType:string = "food";
  file:string = "";
  foodTypeId:number = 0;
  id: number = 0;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchFoodTypes();
    this.fetchData();
  }

  fetchFoodTypes(){
    try {
        this.http.get(config.apiServer+'/api/foodType/list')
                  .subscribe((res:any)=>{
                    this.foodTypes = res.data;
                    this.foodTypeId = this.foodTypes[0].id;
                  });
    } catch (error:any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
    
  }  

  fetchData(){
    try {
      this.http.get(config.apiServer+'/api/food/list')
       .subscribe((res:any)=>{
          this.foodSizes = res.data;
        });    
    }catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }
  clearForm(){
    this.name = "";
    this.remark= "";
    this.price = 0;
    this.foodType= "food";
    this.file = "";
    this.foodTypeId = 0;
  }
  save(){
    try {
      const payload = {
        foodTypeId : this.foodTypeId,
        name :  this.name,
        remark : this.remark,
        price :  this.price,
        image : this.file,
        foodType: this.foodType,
        id:this.id
      };
      if(this.id > 0){
        this.http.put(config.apiServer+'/api/food/update',payload)
       .subscribe((res:any)=>{
          this.fetchData();
          this.id = 0; 
          this.clearForm();
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Food updated successfully',
            })
          })
      }else{
          this.http.post(config.apiServer+'/api/food/create',payload)
          .subscribe((res:any)=>{
            this.fetchData();
            this.clearForm();
            Swal.fire({
              icon:'success',
              title: 'Success',
              text: 'Food added successfully',
              })
          })
      }
      document.getElementById(`modalFood_btnClose`)?.click();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }
}
