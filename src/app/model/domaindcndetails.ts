import {DcnDeploymentType} from "./dcndeploymenttype";
import {CustomerNetwork} from "./customernetwork";

export class DomainDcnDetails {
    public id: number;
    public domainCodename: string;
    public dcnConfigured: boolean = false;
    public dcnDeploymentType: string = DcnDeploymentType[DcnDeploymentType.MANUAL];
    public customerNetworks: CustomerNetwork[] = [new CustomerNetwork()];
}