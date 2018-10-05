const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const filename = process.argv[2];
let newFilename = filename;
const text = fs.readFileSync(filename, 'utf8');

newFilename = newFilename.substr(0, newFilename.lastIndexOf('.'));


console.log(newFilename);

let newText = text;
let toHtmlText = '';

let autoNum = 0;
let caculChar = 0;
let strStart = 0;
let divStart = 0;

let checkFlag = 1;

for (i=0; i < newText.length; i++) {

	let word = newText.charAt(i);
	let k = i + 1;

	while ( word === '<') {
		let nextWord = newText.charAt(i+1);
		caculChar = caculChar + 1;

		switch (nextWord) {
			case '/':
				while ( nextWord !== '>') {
					k = k+1;
					caculChar = caculChar + 1;
					nextWord = newText.charAt(k);
				}
				strStart  = k + 1 ;
				caculChar = caculChar + 2;
				toHtmlText = toHtmlText + (newText.substring(divStart,i) + '</span>');
				checkFlag = 1;
		  break;
			default:
				if (checkFlag === 1) {

					toHtmlText = toHtmlText + (newText.substring(strStart,i));

				  while ( nextWord !== '>') {
						k = k+1;
						caculChar = caculChar + 1;
						nextWord = text.charAt(k);
					}

					if (i+1 < k) {
						autoNum = autoNum + 1;
						toHtmlText = toHtmlText + ('<span class="' + newText.substring(i+1,k) + '" onClick="tagSelect(\'' + newText.substring(i+1,k) + '\', event)">');
						divStart = k+1 ;
						checkFlag = 0;
					}
				} else {
					while ( nextWord !== '>') {
						k = k+1;
						caculChar = caculChar + 1;
						nextWord = newText.charAt(k);
					}
					strStart  = k + 1 ;
					caculChar = caculChar + 2;
					toHtmlText = toHtmlText + (newText.substring(divStart,i) + '</span>');
					console.log('unclosed tag had been revised...');
					checkFlag = 1;
				}

		}

		word = '';
	}

}

toHtmlText = toHtmlText.replace(/(?:\r\n|\r|\n)/g, '<br>\n');

let fileTitle = newFilename;

var noneExistFileName = [fileTitle, '.html'].join('');
fs.writeFile(noneExistFileName, toHtmlText, function(err){
    if(err) throw err;
		console.log('exported file : ' + fileTitle + '.html');
    console.log('\n**** SUCCESS !! file has been transferred ****');
});
