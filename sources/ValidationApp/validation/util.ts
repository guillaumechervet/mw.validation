
//define([], function () {


   
   

    /* Ajouter une séquence de caractères à un string */
    /* function padLeft(s, lenght, paddingChar) {
            s = s.toString();
            while (s.length < lenght) {
                s = paddingChar + s;
            }

            return s;
        }*/


 


export class Util  {
    public isEmptyVal(val:any) :Boolean { 
         if (val === undefined) {
            return true;
        }
        if (val === null) {
            return true;
        }

        if (val === 0) {
            return false;
        }

        if (val.toString() == Number.NaN.toString()) {
            return true;
        }

        if (val === "") {
            return true;
        } else {
            return false;
        }
    }
    
    public isDate(val:any): boolean{
        return Object.prototype.toString.apply(val) === "[object Date]";
    } 


        public toDate(val:any): Date{
             /* Convertir un string de type dd/mm/yyyy en type Date */
        return Globalize.parseDate(val);
        }
        public formatDate(date: Date): string {
            
            var d = date.getDate();
            var m = date.getMonth() + 1; //Months are zero based
            var y = date.getFullYear();

             return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;

        }
        public sortHashTable(hashTable: Array<any>, key: string, removeKey:boolean=false) : Array<any>{
               //  hashTable: le tableau d’objets
    //  key: la clé par laquelle on va trier le tableau
    //  removeKey: [OPTIONNEL] Un booléen égal à true si on veut supprimer ou non la clé qui nous permet de trier.
        hashTable = (hashTable instanceof Array ? hashTable : []);
        var newHashTable = hashTable.sort(function (a:any, b:any) {
            if (typeof (a[key]) === "number") {
                return a[key] - b[key];
            } else {
                if(a[key] > b[key]){
                        return   1
                } else{
                    return 0;
                }
                
            };
        });
        if (removeKey) {
            for (var i in newHashTable) {
                delete newHashTable[i][key];
            }
        }
        return newHashTable;
        }
}



//export = new Util();



//});



