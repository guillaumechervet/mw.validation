# mw.validation

This librarie is able to validate an entire javascript Object or just properties. The main features:
- The syntaxe is human readable.
- You can still validate with the code (the phylosophy is; you will ever have specific validation)
- Full object validation
- Single property object validation from 2 side
    - Single propery validation from a view (everything is a string) https://www.guillaume-chervet.fr/articles/item/0548276c-4209-4b8f-beb8-da9067840248/encore-un-peu-de-validation
        - will require "parsing"
    - Single property validation from an object to a view
        - will require "formatting"

- Pre-customize rules :
    - url
    - require
    - digit: represent an integer
    - string 
    - color
    - minLength
    - maxLength
    - date
    - etc. //TODO

# How to use it in node.js

Install it with : 
- npm install mw.validation --save-dev

Inside node you will use Object validation:

```
var validation = require('mw.validation');

var model = {
        id: "3",
        name: "Ploufragan",
        author: "Guillaume",
        review: 3,
        image: {
          url: "http://localhost:8081/api/files/7577fcc0-0580-11e7-a2b8-5dcb02604871_hackathon.PNG",
          title: ""
        }
      };

const rules = {
                id: ['required'],
                name: ['required', {
                    minLength: {
                        minLength: 3
                    }
                }, {
                    maxLength: {
                        maxLength: 100
                    }
                }, {
                    pattern: {
                        regex: /^[a-zA-Z -]*$/
                    }
                }],
                author: ['required'],
                review: ['required', 'digit'],
                '@image': {
                    url: ['url'],
                    title: [{
                        required: {
                            onlyIf: onlyIf,
                            message: 'Field Image title is required'
                        }
                    }]
                }
            };
            var validationResult = validation.objectValidation.validateModel(newPlace, rules, true);

            if (!validationResult.success) {
               console.log(validationResult.detail);
            }
```

# Object validation samples

```
    (function () {
      var model = {
        id: "3",
        name: "Ploufragan",
        author: "Guillaume",
        review: 3,
        image: {
          url: "http://localhost:8081/api/files/7577fcc0-0580-11e7-a2b8-5dcb02604871_hackathon.PNG",
          title: ""
        }
      };

      var rules = {
        id: ['required'],
        name: ['required'],
        author: ['required'],
        review: ['required', 'digit'],
        '@image': {
          url: ['url'],
          title: ['required']
        }
      };

      var result = mw.objectValidation.validateModel(model, rules);

      console.log(JSON.stringify(result));
      // {"success":false,"detail":{"model.image.url.url":"Veuillez saisir une url valide.","model.image.title.required":"Le champ est requis."}}

      var model = {
        id: "3",
        name: "sd",
        author: "Guillaume",
        review: 3,
        image: {
          url: "",
          title: ""
        },
        youhou: ''
      };

      var result2 = mw.objectValidation.validateModel(model, rules, true);

      console.log(JSON.stringify(result2));
      // {"success":false,"detail":{"model.youhou.illegal":"La proprieté n'est pas authorisée.","model.image.title.required":"Le champ est requis."}}

      var onlyIf = function(){
         if(model.image && model.image.url){
           return true;
         }
         return false;
      }

        var rules3 = {
        id: ['required'],
        name: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100}}, {pattern: { regex: /^[a-zA-Z -]*$/}} ],
        author: ['required'],
        review: ['required', 'digit'],
        '@image': {
          url: ['url'],
          title: [ { required: { onlyIf:onlyIf, message: 'Field Image title is required' }}]
        }
      };
       var result3 = mw.objectValidation.validateModel(model, rules3, true);
      console.log(JSON.stringify(result3));
      // {"success":false,"detail":{"model.name.minLength":"Veuillez saisir au moins 3 caractère(s).","model.youhou.illegal":"La proprieté n'est pas authorisée."}}

       var model = {
        id: "3",
        name: "sd",
        author: "Guillaume",
      };

       var result4 = mw.objectValidation.validateModel(model, rules3, true);
      console.log(JSON.stringify(result4));
      // {"success":false,"detail":{"model.name.minLength":"Veuillez saisir au moins 3 caractère(s).","model.review.notfound":"La proprieté n'est pas présente.","model.image.notfound":"La proprieté n'est pas présente."}}

```

# View validation samples

// TODO