import { Component } from '@angular/core';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import config  from '../../config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taste',
  standalone: true,
  imports: [PopUpComponent,FormsModule,RouterLink],
  templateUrl: './taste.component.html',
  styleUrl: './taste.component.css'
})
export class TasteComponent {
  id:number = 0;
  foodTypeId:number = 0;
  name:string = "";
  remark:string = "";
  tastes:any[] = [];
  foodTypes:any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchDataFoodTypes();
    this.fetchData();
  }
  

  fetchDataFoodTypes() {
    try {
      this.http.get(config.apiServer + '/api/foodType/list').subscribe((res:any) => {
        this.foodTypes = res.data;
        this.foodTypeId = this.foodTypes[0].id;
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Something went wrong! \n ${error.message}`,
      })
    }
  }


  fetchData(){
    try{
      this.http.get(config.apiServer + '/api/taste/list').subscribe((res:any) => {
        this.tastes = res.data;
      });

    }catch(error: any){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Something went wrong! \n ${error.message}`,
      })
    }

  }
  save(){
    try{
      const payload = {
        id: this.id, 
        foodTypeId: parseInt(this.foodTypeId.toString()),
        name: this.name,
        remark: this.remark
      }

      if(this.id > 0){
        this.http.put(config.apiServer + '/api/taste/update', payload).subscribe((res:any) => {
          this.fetchData();
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Taste has been updated successfully!',
          })
        });
      }
      else{
        this.http.post(config.apiServer + '/api/taste/create', payload).subscribe((res:any) => {
          this.fetchData();
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Taste has been saved successfully!',
          })
        });
      }

          
    }catch(error: any){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Something went wrong! \n ${error.message}`,
      })
    }  
    document.getElementById('modalTaste_btnClose')?.click();     
  }
  edit(item:any){
    this.id = item.id;
    this.foodTypeId = item.foodTypeId;
    this.name = item.name;
    this.remark = item.remark;    
  }
  async remove(item:any){
    try {
      const button = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      if (button.isConfirmed) {
        this.http.delete(config.apiServer + '/api/taste/remove/' + item.id).subscribe((res:any) => {
          this.fetchData();
          Swal.fire({
            icon:'success',
            title: 'Success',
            text: 'Taste has been deleted successfully!',
          })
        });
      }     
      
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Something went wrong! \n ${error.message}`,
      })
      
    }
  }
}
