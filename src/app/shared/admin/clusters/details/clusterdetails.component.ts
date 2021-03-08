import {
    Cluster,
    ClusterExtNetwork,
    IngressCertificateConfigOption,
    IngressControllerConfigOption,
    IngressResourceConfigOption,
    NamespaceConfigOption
} from '../../../../model/cluster';
import {BaseComponent} from '../../../common/basecomponent/base.component';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'nmaas-clusterdetails',
    templateUrl: './clusterdetails.component.html',
    styleUrls: ['./clusterdetails.component.css']
})
export class ClusterDetailsComponent extends BaseComponent implements OnInit {

    controllerConfigOption: Map<string, IngressControllerConfigOption> = new Map<string, IngressControllerConfigOption>();

    resourceConfigOption: Map<string, IngressResourceConfigOption> = new Map<string, IngressResourceConfigOption>();

    namespaceConfigOption: Map<string, NamespaceConfigOption> = new Map<string, NamespaceConfigOption>();

    certificateConfigOption: Map<string, IngressCertificateConfigOption> = new Map<string, IngressCertificateConfigOption>();

    @Input()
    public cluster: Cluster = new Cluster();

    @Input()
    public error: string;

    @Output()
    public onSave: EventEmitter<Cluster> = new EventEmitter<Cluster>();

    @Output()
    public onDelete: EventEmitter<string> = new EventEmitter<string>();

    constructor(private router: Router) {
        super();
        this.initializeMaps();
    }

    ngOnInit() {

    }

    public submit(): void {
        this.onSave.emit(this.cluster);
    }

    public remove(clusterName: string) {
        this.onDelete.emit(clusterName);
    }

    public removeNetwork(id) {
        this.cluster.externalNetworks.splice(
            this.cluster.externalNetworks.findIndex(
                function (i) {
                    return i.id = id;
                }), 1);
    }

    public addNetwork() {
        const newobj: ClusterExtNetwork = new ClusterExtNetwork();
        this.cluster.externalNetworks.push(newobj);
    }

    public trackByFn(index) {
        return index;
    }

    public getKeys(map) {
        return Array.from(map.keys());
    }

    private initializeMaps() {
        this.resourceConfigOption.set('Do nothing', IngressResourceConfigOption.NOT_USED);
        this.resourceConfigOption.set('Deploy new resource from the definition in the application chart', IngressResourceConfigOption.DEPLOY_FROM_CHART);
        this.controllerConfigOption.set('Use existing', IngressControllerConfigOption.USE_EXISTING);
        this.controllerConfigOption.set('Deploy new controller from chart repository', IngressControllerConfigOption.DEPLOY_NEW_FROM_REPO);
        this.controllerConfigOption.set('Deploy new controller from local chart archive', IngressControllerConfigOption.DEPLOY_NEW_FROM_ARCHIVE);
        this.namespaceConfigOption.set('Use default namespace', NamespaceConfigOption.USE_DEFAULT_NAMESPACE);
        this.namespaceConfigOption.set('Use domain namespace', NamespaceConfigOption.USE_DOMAIN_NAMESPACE);
        this.namespaceConfigOption.set('Create namespace', NamespaceConfigOption.CREATE_NAMESPACE);
        this.certificateConfigOption.set('Use my own wildcard certificate', IngressCertificateConfigOption.USE_WILDCARD);
        this.certificateConfigOption.set('Generate LetsEncrypt certificates automatically', IngressCertificateConfigOption.USE_LETSENCRYPT);
    }
}
