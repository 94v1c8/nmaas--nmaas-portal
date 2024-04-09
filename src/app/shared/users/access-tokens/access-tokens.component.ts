import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AccessToken} from './access-token';
import {AccessTokenService} from './access-token.service';

@Component({
    selector: 'app-access-tokens',
    templateUrl: './access-tokens.component.html',
    styleUrls: ['./access-tokens.component.css']
})
export class AccessTokensComponent implements OnInit {

    public tokens: Observable<AccessToken[]> = undefined;
    public tokensList: AccessToken[] = [];

    constructor(private tokenService: AccessTokenService) {
    }

    ngOnInit() {
        this.tokens = this.tokenService.getAll();
        this.getData();
    }

    getData() {
        this.tokensList = [];
        this.tokens.subscribe(
            data => {
                this.tokensList.push(...data);
                console.log('tokens: ', data)
            },
            error => {
                console.error(error);
            }
        )
    }

    invalidate(id: number) {
        this.tokenService.invalidate(id).subscribe(
            data => {
                console.log('invalidating access token id: ' + id + ' success');
                this.getData();
            },
            error => {
                console.error(error);
            }
        );
    }

    public createNewToken() {
        console.log('trying to create new token')
        this.tokenService.createToken().subscribe({
            next: val => {
                console.log('access token created: ', val)
                this.tokensList.push(val)
            },
            error: err => console.warn(err)
        })
    }
}
