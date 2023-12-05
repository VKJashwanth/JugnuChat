var filter = require('./filter.js');

// set locale to hindi
filter.setLocale(['hi', 'en-uk']);
var locale = filter.getLocale();

// Input string with bad words... 
var inputString = "Bhadve is a very bad word is Hindi. It means pimp in English. You should not use words like these. Some other examples are lund which means penis or randi which means whore. Bad language should never be used. It is hurtful and disrespectful. Live and let live!";

var grawlix_output = filter.replace(inputString, 'grawlix');

var default_star_output = filter.replace(inputString);

var word_output = filter.replace(inputString, 'word', 'BADWORD');

console.log("-------------- OUTPUTS ---------------");
console.log("\nSet locale is " + locale.toString());
console.log("\nOffensive input string is:\n" +  inputString);
console.log("\nInput filtered with grawlix:\n" +  grawlix_output);
console.log("\nInput filtered with default star output:\n" +  default_star_output);
console.log("\nInput filtered with word output:\n" +  word_output);
