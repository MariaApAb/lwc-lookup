import { LightningElement, api } from "lwc";

export default class LookupListItem extends LightningElement {
    @api sobj;
    @api index;
    @api iconName;

    handleOnClick() {
        this.dispatchEvent(new CustomEvent("itemclick", { detail: this.sobj }));
    }
}
