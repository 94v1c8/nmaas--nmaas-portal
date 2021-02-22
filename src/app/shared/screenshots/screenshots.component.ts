import { Component, OnInit, Input, ViewEncapsulation} from '@angular/core';


import { AppsService } from '../../service';
import { FileInfo } from '../../model';


@Component({
    selector: 'screenshots',
    templateUrl: './screenshots.component.html',
    styleUrls: ['./screenshots.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ScreenshotsComponent implements OnInit {

    @Input()
    public pathUrl: string;

    public imagesFileInfo: FileInfo[];

    public selectedImg: string;

    public customModalVisible = false;
    public customModalVisibleAnimate = false;

    constructor(public appsService: AppsService) {
    }

    ngOnInit() {
        this.appsService.getAppScreenshotsByUrl(this.pathUrl).subscribe(fileInfos => this.imagesFileInfo = fileInfos);
    }

    public showImage(url: string): void {
        this.selectedImg = url;
        this.showModal();
    }

    public showModal(): void {
        setTimeout( () => this.customModalVisible = true, 50);
        setTimeout(() => this.customModalVisibleAnimate = true, 100);
    }

    public hideModal(): void {
        this.customModalVisibleAnimate = false;
        setTimeout(() => this.customModalVisible = false, 100);
    }

}
