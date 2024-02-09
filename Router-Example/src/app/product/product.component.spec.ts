import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Use imports instead of declarations for standalone components
      imports: [ ProductComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              name: 'Zack'
            })
          }
        }
      ]
    })
    .compileComponents();
  });
    
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
