import { LightningElement, api } from 'lwc';

export default class X3nModal extends LightningElement {

    @api textHeader;
    @api cancelLabel = "Cancel";
    @api submitLabel = "Submit";
    @api size = "small";
    @api disabledSubmit = false;
    @api disabledCancel = false;

    close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    submit() {
        this.dispatchEvent(new CustomEvent('submit'));
    }

    get classes() {
        return 'slds-modal slds-fade-in-open slds-modal_' + this.size;
    }

}