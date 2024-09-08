import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBootStrapComponent } from './my-boot-strap.component';

describe('MyBootStrapComponent', () => {
  let component: MyBootStrapComponent;
  let fixture: ComponentFixture<MyBootStrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBootStrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBootStrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
