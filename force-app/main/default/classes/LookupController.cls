public with sharing class LookupController {

    @AuraEnabled(cacheable=true)
    public static List<Result> findSObjects(String searchKey, String recordApiName, String titleApiName, String subtitleApiName) {
        //System.debug('SELECT ' + titleApiName + ', ' + subtitleApiName + ' FROM ' + recordApiName + ' WHERE ' + titleApiName + ' LIKE \'%' + searchKey + '%\' LIMIT 5');
        List<String> arguments = new List<String>{
            '\'' + String.escapeSingleQuotes(searchKey) + '\'',
            String.escapeSingleQuotes(recordApiName),
            String.escapeSingleQuotes(titleApiName),
            String.escapeSingleQuotes(subtitleApiName)
        };
        List<Result> results = new List<Result>();
        String searchQuery = String.format('FIND {0} IN ALL FIELDS RETURNING {1} (Id, {2}, {3}) LIMIT 5', arguments);
        List<List<SObject>> result = Search.query(searchQuery);
        System.debug(result);
        if (!result.isEmpty()) {
            for (SObject sobj : result[0]) {
                results.add(new Result(searchKey, (Id)sobj.get('Id'), String.valueOf(sobj.get(titleApiName)), String.valueOf(sobj.get(subtitleApiName))));
            }
        }
        /*for (SObject sobj : Database.query('SELECT ' + titleApiName + ', ' + subtitleApiName + ' FROM ' + recordApiName + ' WHERE ' + titleApiName + ' LIKE \'%' + searchKey + '%\' LIMIT 4')) {
            results.add(new Result(searchKey, (Id)sobj.get('Id'), String.valueOf(sobj.get(titleApiName)), String.valueOf(sobj.get(subtitleApiName))));
        }*/
        System.debug(results);
        return results;
    }

    public class Result {
        @AuraEnabled public Id id;
        @AuraEnabled public String title;
        @AuraEnabled public String subtitle;
        @AuraEnabled public List<TitlePart> titleParts;
        public Result(String searchKey, Id id, String title, String subtitle) {
            this.id = id;
            this.title = title;
            this.subtitle = subtitle;
            this.titleParts = new List<TitlePart>();
            getTitle(searchKey, title);
        }
        private void getTitle(String searchKey, String title) {
            Integer indexOf = title.toUpperCase().indexOf(searchKey.toUpperCase());
            if (indexOf != -1) {
                if (indexOf == 0) {
                    this.titleParts.add(new TitlePart(this.id + '0', title.substring(0, searchKey.length()), true));
                    this.titleParts.add(new TitlePart(this.id + '1', title.substring(searchKey.length(), title.length()), false));
                } else if (indexOf > 0) {
                    this.titleParts.add(new TitlePart(this.id + '0', title.substring(0, indexOf), false));
                    this.titleParts.add(new TitlePart(this.id + '1', title.substring(indexOf, indexOf + searchKey.length()), true));
                    if (indexOf + searchKey.length() < title.length()) this.titleParts.add(new TitlePart(this.id + '2', title.substring(indexOf + searchKey.length(), title.length()), false));
                }
            } else this.titleParts.add(new TitlePart(this.id + '0', title, false));
        }
    }

    public class TitlePart {
        @AuraEnabled public String key;
        @AuraEnabled public String part;
        @AuraEnabled public Boolean strong;
        public TitlePart(String key, String part, Boolean strong) {
            this.key = key;
            this.part = part;
            this.strong = strong;
        }
    }

}
