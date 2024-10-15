import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import config from '../../config';
import { PopUpComponent } from "../pop-up/pop-up.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [FormsModule, PopUpComponent,RouterLink ],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.css'
})
export class FoodTypeComponent {

  name: string = '';
  remark: string = '';
  foodTypes: any = [];
  id: number = 0;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchData();
  }
  fetchData() {
    this.http
      .get(config.apiServer + '/api/foodType/list')
      .subscribe((res: any) => {
        this.foodTypes = res.data;
      });
  }
  cleadForm() {
    this.name = '';
    this.remark = '';
    this.id = 0;
  }
  save() {
    try {
      const payload = {
        name: this.name,
        remark: this.remark,
        id: 0,
      };
      // Already have item 
      if (this.id > 0) {
        payload.id = this.id;

        this.http
          .put(config.apiServer + '/api/foodType/update', payload)
          .subscribe((res: any) => {
            this.fetchData();
            this.id = 0;
            Swal.fire({
              title: 'Success',
              text: 'Food Type updated successfully',
              icon:'success',});
          });

      }
      // New item
      else {
        this.http
          .post(config.apiServer + '/api/foodType/create', payload)
          .subscribe((res) => {
            this.fetchData();
          });
        Swal.fire({
            title: 'Success',
            text: 'Food Type created successfully',
            icon:'success',});
      }

      document.getElementById('modalFoodType_btnClose')?.click();
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  async remove(item: any) {

    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => { 
        if (result.isConfirmed) {
          this.http
           .delete(config.apiServer + '/api/foodType/remove/' + item.id)
           .subscribe((res) => {
              this.fetchData();
           });
          Swal.fire(
            'Deleted!',
            `The food type ${item.name} has been deleted.`,
           'success'
          )
        }
      })
      
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
    
  }

  async edit(item: any) {
      this.name = item.name;
      this.remark = item.remark;
      this.id = item.id;   

  }

}
