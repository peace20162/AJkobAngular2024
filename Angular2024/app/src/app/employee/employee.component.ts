import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  //Two way Binding
  imports: [FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  //One way binding
  name = 'peace';
  
  cssClass = 'myClass';

  @Input() fullName:string = 'default value';
}
