import { Component ,ElementRef,ViewChild } from '@angular/core';
import { PopUpComponent } from "../pop-up/pop-up.component";
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import { FormControl, FormGroup, FormGroupDirective, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [PopUpComponent,FormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})

export class FoodComponent {

  catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
    return promise.then(
      data => {return [undefined, data] as [undefined, T]}
    ).catch(error =>{ return[error]});
  }
  constructor(private http: HttpClient){
    
  }

  foodTypes: any[] = [];
  foods: any[]=[];
  name: string = "";
  remark:string = "";
  price:number = 0;
  foodType:string = "food";
  fileName :string = "";
  foodTypeId:number = 0;
  id: number = 0;
  file: File | undefined = undefined;
  serverPath:string = '';
  img: string = '';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.serverPath = config.apiServer;
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
  clearForm(){
    this.name = "";
    this.remark= "";
    this.price = 0;
    this.foodType= "food";
    this.fileName = "";
    this.file = undefined;
    this.foodTypeId = this.foodTypes[0].id;
    this.img = '';
    const img = document.getElementById('img') as HTMLInputElement;
    img.value = '';

  }
  async save(){
    try {
      const fileName = await this.uploadFile();
      const payload = {
        foodTypeId : this.foodTypeId,
        name :  this.name,
        remark : this.remark,
        price :  this.price,
        image : fileName,
        foodType: this.foodType,
        id:this.id
      };
      if(this.id > 0){
        await this.http.put(config.apiServer+'/api/food/update',payload)
                  .subscribe((res:any)=>{
                      this.fetchData();
                      this.id = 0;                       
                      })
        Swal.fire({
          icon:'success',
          title: 'Success',
          text: 'Food updated successfully',
          })

      }else{
          await this.http.post(config.apiServer+'/api/food/create',payload)
                    .subscribe((res:any)=>{
                      this.fetchData();
                    })
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Food added successfully',
            })
      }
      this.clearForm();
      document.getElementById(`modalFood_btnClose`)?.click();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }
  fileSelected(file:any){
    if(file.files !== undefined && file.files.length > 0){
      this.file = file.files[0];
    }
  }

  async uploadFile(){
    if(this.file !== undefined){
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        const response:any = await firstValueFrom(this.http.post(config.apiServer+'/api/food/upload', formData));
        return response.fileName;
      } catch (error: any) {
        Swal.fire({
          icon: 'error', 
          title: 'Oops...',
          text: error.message,
        })
      }
      formData.delete('file');
    }
  }
  async delete(item:any){
    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(config.apiServer+'/api/food/remove/'+item.id)
                    .subscribe((res:any)=>{
                      this.fetchData();           
                    });
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Food deleted successfully',
          });
        }
      })
      
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }

  edit(item:any){
    this.id = item.id;
    this.name = item.name;
    this.remark = item.remark;
    this.price = item.price;
    this.foodType = item.foodType;
    this.foodTypeId = item.foodTypeId;
    this.img = item.image;    
    this.file = undefined;
    const img = document.getElementById('img') as HTMLInputElement;
    img.value = '';  

  }
  removeImage(id:number){
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.img = '';
          this.file = undefined;
          this.fileName = '';
          const img = document.getElementById('img') as HTMLInputElement;
          img.value = '';  
          this.http.delete(config.apiServer+'/api/food/removeImage/'+ id).subscribe((res:any)=>{
            this.fetchData();   
          });
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Image removed successfully',
          });}
      });      
     

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }

  
  fliterAll() {
    this.fetchData();
  }
  filterBeverage() {
    this.filterFoodType('beverage');
    
  }
  filterFood() {
    this.filterFoodType('food');
    
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

}
