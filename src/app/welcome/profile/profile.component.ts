import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../../service/profile.service';
import {User} from '../../model';
import {BaseComponent} from '../../shared/common/basecomponent/base.component';
import {TranslateService} from '@ngx-translate/core';
import {ContentDisplayService} from '../../service/content-display.service';
import {InternationalizationService} from '../../service/internationalization.service';
import {UserService} from '../../service';
import {Router} from '@angular/router';
import {ComponentMode} from '../../shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent extends BaseComponent implements OnInit {

  public user: User;
  public languages: string[];
  public errorMessage: string;
  public userDetailsMode: ComponentMode = ComponentMode.VIEW;
  public userPreferencesMode: ComponentMode = ComponentMode.VIEW;

  constructor(protected profileService: ProfileService,
              private translate: TranslateService,
              private contentService: ContentDisplayService,
              private router: Router,
              public userService: UserService,
              private languageService: InternationalizationService) {
      super();
  }

  setLanguage(language: string) {
    this.userService.setUserLanguage(this.user.id, language).subscribe(() => {
      this.user.selectedLanguage = language;
      localStorage.setItem('lang', language);
      this.translate.use(language);
    });
  }

  getPathToCurrent() {
    return 'assets/images/country/' + this.user.selectedLanguage + '_circle.png';
  }

  public getSupportedLanguages() {
    this.languageService.getEnabledLanguages().subscribe(langs => {
      this.translate.addLangs(langs);
      this.languages = langs;
    });
  }

  ngOnInit() {
    this.getSupportedLanguages();
    this.profileService.getOne().subscribe((user) => {
      this.user = user
    });
  }

  public onRefresh() {
    this.profileService.getOne().subscribe((user) => {
        this.user = user;
        this.onModeChange();
        this.errorMessage = undefined;
    });
  }

  public onPreferencesRefresh() {
    this.profileService.getOne().subscribe((user) => {
      this.user = user;
      this.userPreferencesMode = (this.userPreferencesMode === ComponentMode.VIEW ? ComponentMode.EDIT : ComponentMode.VIEW);
      this.errorMessage = undefined;
    });
  }

  public onModeChange() {
      this.userDetailsMode = (this.userDetailsMode === ComponentMode.VIEW ? ComponentMode.EDIT : ComponentMode.VIEW);
  }

  public onSave($event) {
    const user: User = $event;

    if (!!user && user.id) {
      this.updateUser(user.id, user);
    }
  }

  public updateUser(userId: number, user: User): void {
    this.userService.updateUser(userId, user).subscribe(
        result => {
          this.userDetailsMode = ComponentMode.VIEW;
          this.userPreferencesMode = ComponentMode.VIEW;
          this.errorMessage = undefined;
        },
        error => {
          this.userDetailsMode = ComponentMode.EDIT;
          this.userPreferencesMode = ComponentMode.EDIT;
          this.errorMessage = error.message;
        }
    )
  }
}
