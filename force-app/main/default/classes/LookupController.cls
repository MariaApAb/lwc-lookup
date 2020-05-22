public with sharing class LookupController {

    @AuraEnabled(cacheable=true)
    public static List<Result> findSObjects(String searchKey, String recordApiName, String titleApiName, String subtitleApiName) {
        System.debug('SELECT ' + titleApiName + ', ' + subtitleApiName + ' FROM ' + recordApiName + ' WHERE ' + titleApiName + ' LIKE \'%' + searchKey + '%\' LIMIT 5');
        List<Result> results = new List<Result>();
        for (SObject sobj : Database.query('SELECT ' + titleApiName + ', ' + subtitleApiName + ' FROM ' + recordApiName + ' WHERE ' + titleApiName + ' LIKE \'%' + searchKey + '%\' LIMIT 5')) {
            results.add(new Result((Id)sobj.get('Id'), String.valueOf(sobj.get(titleApiName)), String.valueOf(sobj.get(subtitleApiName))));
        }
        System.debug(results);
        return results;
    }

    public class Result {
        @AuraEnabled public Id id;
        @AuraEnabled public String titleApiName;
        @AuraEnabled public String subtitleApiName;
        public Result(Id id, String titleApiName, String subtitleApiName) {
            this.id = id;
            this.titleApiName = titleApiName;
            this.subtitleApiName = subtitleApiName;
        }
    }

}
