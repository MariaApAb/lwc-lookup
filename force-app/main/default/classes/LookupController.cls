public with sharing class LookupController {

    @AuraEnabled(cacheable=true)
    public static List<SObject> findSObjects(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Phone 
            FROM Account
            WHERE Name LIKE :key
            LIMIT 10
        ];
    }

}
