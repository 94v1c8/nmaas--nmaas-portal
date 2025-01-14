import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RatingExtendedComponent} from './rating-extended.component';
import {AppsService} from '../../service';
import {Observable, of} from 'rxjs';
import {Rate} from '../../model';
import {HttpResponse} from '@angular/common/http';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class MockAppService {
    public getAppRateByUrl(urlPath: string): Observable<Rate> {
        return of(new Rate(1, 1, new Map()));
    }

    public setMyAppRateByUrl(urlPath: string): Observable<any> {
        return of(HttpResponse.prototype);
    }
}

describe('RatingExtendedComponent', () => {
    let component: RatingExtendedComponent;
    let fixture: ComponentFixture<RatingExtendedComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RatingExtendedComponent],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
            ],
            providers: [
                {provide: AppsService, useClass: MockAppService},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RatingExtendedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
