/**
 * @file Entry class for read data from Excel files and write to output json file
 */

const _ = require('underscore');
const fs = require('fs');
const DataHelper = require('./helpers/dataHelper');

let inputPath = '';
let outputPath = '';

// Command line arguments - Get pre-configs
process.argv.forEach(function (val, index, array) {
    const [command, value = null] = val.split('=');

    if (!_.isNull(value)) {
        switch (command.toLowerCase()) {
            case 'excel-folder-path':
                inputPath = value;
                break;
            case 'json-file-path':
                outputPath = value;
                break;        
            default:
                break;
        }
    }
});

// Load excel file data from data folder
const data = DataHelper.load({
    path: inputPath
});

// Write data to .json file
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));