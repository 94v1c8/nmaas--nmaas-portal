import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkListComponent } from './bulk-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('BulkListComponent', () => {
  let component: BulkListComponent;
  let fixture: ComponentFixture<BulkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkListComponent ],
      imports: [
          HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
