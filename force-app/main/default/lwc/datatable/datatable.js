import { LightningElement, api, track, wire } from "lwc";
import getDatatableColumns from "@salesforce/apex/LookupController.getDatatableColumns";

/*
const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];
*/
export default class Datatable extends LightningElement {
    @api fields;
    @api sobjectApiName;
    @api results;
    @api hideCheckboxColumn = false;

    @track columns = [
        { label: "Label", fieldName: "Name", type: "text" },
        { label: "Website", fieldName: "Site", type: "url" },
        { label: "Phone", fieldName: "Phone", type: "phone" }
    ];

    /*@wire(getDatatableColumns, { sobjectApiName: "$sobjectApiName", fields: "$fields" })
    wiredColumns({ error, data }) {
        if (data) {
            this.columns = data;
        } else if (error) {
            console.error(error);
        }
    }*/
}
