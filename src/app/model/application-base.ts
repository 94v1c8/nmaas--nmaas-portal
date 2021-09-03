import {AppDescription} from './app-description';
import {ApplicationVersion} from './application-version';
import {Rate} from './rate';
import {Tag} from './tag';

export class ApplicationBase {
    public id: number = undefined;
    public name: string = undefined;

    public license: string = undefined;
    public licenseUrl: string = undefined;

    public wwwUrl: string = undefined;
    public sourceUrl: string = undefined;
    public issuesUrl: string = undefined;
    public nmaasDocumentationUrl: string = undefined;

    public descriptions: AppDescription[] = [];
    public tags: Tag[] = [];
    public versions: ApplicationVersion[] = [];

    public owner: string = undefined;

    public rate: Rate = undefined;
}
