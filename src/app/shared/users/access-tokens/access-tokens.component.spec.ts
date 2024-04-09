import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccessTokensComponent} from './access-tokens.component';

describe('AccessTokensComponent', () => {
  let component: AccessTokensComponent;
  let fixture: ComponentFixture<AccessTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessTokensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
