'use strict';

var fs = require('fs');
module.exports={

    getSupportedLocales: function(){
       
        var fileNames = fs.readdirSync( __dirname + '/../seed');
        var validLocales = [];
        fileNames.forEach(function(f){
            validLocales.push(f.replace(/\.[^/.]+$/, ""));
        });
        return validLocales;
    },
}; 
