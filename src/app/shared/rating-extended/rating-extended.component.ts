import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Rate} from '../../model';
import {AppsService} from '../../service';


@Component({
  selector: 'rating-extended',
  templateUrl: './rating-extended.component.html',
  styleUrls: ['./rating-extended.component.css']
})
export class RatingExtendedComponent implements OnInit, OnChanges {

  @Input()
  private pathUrl: string;

  @Input()
  editable = false;

  defaultTooltipOptions = {
    'placement': 'bottom',
    'show-delay': '500',
    'theme': 'dark'
  };

  rate: Rate;

  @Output()
  onChange = new EventEmitter<boolean>()

  public fiveStarPerc = 0;
  public fiveStarCount = 0;

  public fourStarPerc = 0;
  public fourStarCount = 0;

  public threeStarPerc = 0;
  public threeStarCount = 0;

  public twoStarPerc = 0;
  public twoStarCount = 0;

  public oneStarPerc = 0;
  public oneStarCount = 0;

  constructor(private appsService: AppsService) { }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pathUrl']) {
      this.refresh();
    }
  }

  public setBreakdownsValues() {
    document.getElementById('five-star-progress').style.width = this.fiveStarPerc + '%';
    document.getElementById('four-star-progress').style.width = this.fourStarPerc + '%';
    document.getElementById('three-star-progress').style.width = this.threeStarPerc + '%';
    document.getElementById('two-star-progress').style.width = this.twoStarPerc + '%';
    document.getElementById('one-star-progress').style.width = this.oneStarPerc + '%';
  }

  public updateBreakdownValues() {
    if (this.rate.rating != null) {
      this.oneStarCount = (this.rate.rating.hasOwnProperty(1) ? this.rate.rating[1] : 0);
      this.twoStarCount = (this.rate.rating.hasOwnProperty(2) ? this.rate.rating[2] : 0);
      this.threeStarCount = (this.rate.rating.hasOwnProperty(3) ? this.rate.rating[3] : 0);
      this.fourStarCount = (this.rate.rating.hasOwnProperty(4) ? this.rate.rating[4] : 0);
      this.fiveStarCount = (this.rate.rating.hasOwnProperty(5) ? this.rate.rating[5] : 0);
    }
    const sum = this.oneStarCount + this.twoStarCount + this.threeStarCount + this.fourStarCount + this.fiveStarCount;
    this.oneStarPerc = Math.round((this.oneStarCount / sum) * 100);
    this.twoStarPerc = Math.round((this.twoStarCount / sum) * 100);
    this.threeStarPerc = Math.round((this.threeStarCount / sum) * 100);
    this.fourStarPerc = Math.round((this.fourStarCount / sum) * 100);
    this.fiveStarPerc = Math.round((this.fiveStarCount / sum) * 100) ;
    this.setBreakdownsValues();
  }

  public refresh(): void {
    if (this.pathUrl != null) {
      this.appsService.getAppRateByUrl(this.pathUrl).subscribe(rate => {
        this.rate = rate;
        this.updateBreakdownValues();
      });
    }
  }

  public update(rate: number) {
    if (this.pathUrl != null) {
      if (this.editable) {
        this.appsService.setMyAppRateByUrl(this.pathUrl + '/' + rate).subscribe(apiResponse => {
          this.refresh();
          this.onChange.emit(true);
        });
      }
    }
  }

}
