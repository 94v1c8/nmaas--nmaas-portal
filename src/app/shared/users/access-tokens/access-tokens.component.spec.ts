import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccessTokensComponent} from './access-tokens.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('AccessTokensComponent', () => {
    let component: AccessTokensComponent;
    let fixture: ComponentFixture<AccessTokensComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccessTokensComponent],
            imports: [
                HttpClientTestingModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ]
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
