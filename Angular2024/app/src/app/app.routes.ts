import { Routes } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page.component';
import { SecondPageComponent } from './second-page/second-page.component';
import { MyBootStrapComponent } from './my-boot-strap/my-boot-strap.component';
import { MyFormValidateComponent } from './my-form-validate/my-form-validate.component';
import { ParentComponentComponent } from './parent-component/parent-component.component';

export const routes: Routes = [
    {
        path: 'firstPage/:id',
        component: FirstPageComponent,
    },
    {
        path: 'secondPage',
        component: SecondPageComponent,
    },
    {
        path: 'myBootstrap',
        component: MyBootStrapComponent
    },
    {
        path: 'myFormValidate',
        component: MyFormValidateComponent
    },
    {
        path: 'parentComponent',
        component: ParentComponentComponent,
    },
];
