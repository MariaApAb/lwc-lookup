public with sharing class DatatableController {
    /*
const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];
*/

    @AuraEnabled(cacheable=true)
    public static List<Column> getDatatableColumns(String sobjectApiName, List<String> fields) {
        System.debug(sobjectApiName);
        System.debug(fields);
        try {
            return new List<Column>();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class Columns {
        @AuraEnabled
        public List<Column> columns;
    }

    public class Column {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String fieldName;
        @AuraEnabled
        public String type;
    }
}
