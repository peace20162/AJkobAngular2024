import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { FoodTypeComponent } from './food-type/food-type.component';
import { FoodSizeComponent } from './food-size/food-size.component';
import { TasteComponent } from './taste/taste.component';
import { FoodComponent } from './food/food.component';
import { SaleComponent } from './sale/sale.component';
import { ExamplePdfViewerComponent} from './example-pdf-viewer/example-pdf-viewer.component'

export const routes: Routes = [
    {
        path: '',
        component: SignInComponent,
    },
    {
        path: 'foodType',
        component: FoodTypeComponent,
    },
    {
        path: 'foodSize',
        component: FoodSizeComponent,
    },
    {
        path: 'taste',
        component: TasteComponent,
    },
    {
        path: 'food',
        component: FoodComponent,
    },
    {
        path:'sale',
        component: SaleComponent,

    },
    {
        path: 'pdfReader',
        component: ExamplePdfViewerComponent,
    }
];
