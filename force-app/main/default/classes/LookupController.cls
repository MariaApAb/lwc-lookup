public with sharing class LookupController {
    //TODO: pasar la negrita a js - metodo match + new RegExp(myStr, 'i');
    //TODO: corregir posición botón x item seleccionado

    @AuraEnabled(cacheable=true)
    public static List<Result> findSObjects(
        String searchKey,
        String sobjectApiName,
        String titleApiName,
        String subtitleApiName
    ) {
        List<String> arguments = new List<String>{
            '\'' +
            String.escapeSingleQuotes(searchKey) +
            '\'',
            String.escapeSingleQuotes(sobjectApiName),
            String.escapeSingleQuotes(titleApiName),
            String.escapeSingleQuotes(subtitleApiName)
        };
        List<Result> results = new List<Result>();
        String searchQuery = String.format('FIND {0} IN ALL FIELDS RETURNING {1} (Id, {2}, {3}) LIMIT 5', arguments);
        System.debug(searchQuery);
        List<List<SObject>> result = Search.query(searchQuery);
        if (!result.isEmpty()) {
            for (SObject sobj : result[0]) {
                results.add(
                    new Result(
                        searchKey,
                        (Id) sobj.get('Id'),
                        String.valueOf(sobj.get(titleApiName)),
                        String.valueOf(sobj.get(subtitleApiName))
                    )
                );
            }
        }
        System.debug(results);
        return results;
    }

    @AuraEnabled(cacheable=true)
    public static List<Result> findSObjects2(
        String searchKey,
        String sobjectApiName,
        List<String> fields,
        Boolean returnAllFields
    ) {
        System.debug(returnAllFields);
        List<String> arguments = new List<String>{
            '\'' +
            String.escapeSingleQuotes(searchKey) +
            '\'',
            String.escapeSingleQuotes(sobjectApiName)
        };

        List<String> argumentsAux = new List<String>();

        for (Integer i = 0; i < (!returnAllFields ? 2 : fields.size()); i++) {
            argumentsAux.add(String.escapeSingleQuotes(fields[i]));
        }

        arguments.add(String.join(argumentsAux, ','));

        List<Result> results = new List<Result>();
        String searchQuery = String.format(
            'FIND {0} IN ALL FIELDS RETURNING {1} (Id, {2})' + (!returnAllFields ? ' LIMIT 5' : ''),
            arguments
        );
        System.debug(searchQuery);
        List<List<SObject>> result = Search.query(searchQuery);
        if (returnAllFields) {
            results.add(new Result(result[0]));
        }
        if (!result.isEmpty()) {
            System.debug(result[0].size());
            for (Integer i = 0; i < (result[0].size() > 5 ? 5 : result[0].size()); i++) {
                SObject sobj = result[0][i];
                results.add(
                    new Result(
                        searchKey,
                        (Id) sobj.get('Id'),
                        String.valueOf(sobj.get(fields[0])),
                        String.valueOf(sobj.get(fields[1]))
                    )
                );
            }
        }
        System.debug(results.size());
        System.debug(results);
        return results;
    }

    @AuraEnabled(cacheable=true)
    public static void getDatatableResults(String searchKey, String sobjectApiName, List<String> fields) {
        System.debug(searchKey);
        System.debug(sobjectApiName);
        System.debug(fields);
        try {
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class Result {
        @AuraEnabled
        public Id id;
        @AuraEnabled
        public String title;
        @AuraEnabled
        public String subtitle;
        @AuraEnabled
        public List<TitlePart> titleParts;
        @AuraEnabled
        public List<SObject> data;
        public Result(String searchKey, Id id, String title, String subtitle) {
            this.id = id;
            this.title = title;
            this.subtitle = subtitle;
            this.titleParts = new List<TitlePart>();
            getTitle(searchKey, title);
        }
        public Result(List<SObject> data) {
            this.data = data;
        }
        private void getTitle(String searchKey, String title) {
            Integer indexOf = title.indexOfIgnoreCase(searchKey);
            List<String> parts = title.split('/' + searchKey + '/i', 1);
            if (indexOf != -1) {
                if (indexOf == 0) {
                    this.titleParts.add(new TitlePart(this.id + '0', title.substring(0, searchKey.length()), true));
                    this.titleParts.add(
                        new TitlePart(this.id + '1', title.substring(searchKey.length(), title.length()), false)
                    );
                } else if (indexOf > 0) {
                    this.titleParts.add(new TitlePart(this.id + '0', title.substring(0, indexOf), false));
                    this.titleParts.add(
                        new TitlePart(this.id + '1', title.substring(indexOf, indexOf + searchKey.length()), true)
                    );
                    if (indexOf + searchKey.length() < title.length())
                        this.titleParts.add(
                            new TitlePart(
                                this.id + '2',
                                title.substring(indexOf + searchKey.length(), title.length()),
                                false
                            )
                        );
                }
            } else
                this.titleParts.add(new TitlePart(this.id + '0', title, false));
        }
    }

    public class TitlePart {
        @AuraEnabled
        public String key;
        @AuraEnabled
        public String part;
        @AuraEnabled
        public Boolean strong;
        public TitlePart(String key, String part, Boolean strong) {
            this.key = key;
            this.part = part;
            this.strong = strong;
        }
    }

    public class DatatableResults {
    }
}
