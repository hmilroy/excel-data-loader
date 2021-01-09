/**
 * @file Helper class for get data from Excel spread sheet.
 */

const _ = require('underscore');
const _string = require('underscore.string');
const deasync = require('deasync');
const memCache = require('memory-cache');
const set = require('set-value');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function fo generate object path
function generateObjectPath(filePath) {
    return _string.camelize(
        _string.trim(
            filePath.replace(
                path.extname(filePath), '')
                .replace(/([^a-zA-Z0-9//])/g, "-")
                .toLowerCase()
        )
    ).replace(/(\/)/g, '.');
}

// Function for load data from Excel files
function loadFromExcel(startPath, filter, output={}) {
    if (fs.existsSync(startPath)){
        fs.readdirSync(startPath).forEach((file) => {
            const filename=path.join(startPath,file);
            if (fs.lstatSync(filename).isDirectory()){
                loadFromExcel(filename,filter, output);
            } else if (filter.includes(path.extname(filename))) {
                switch (path.extname(filename)) {
                    case '.xlsx':
                        const workbook = XLSX.readFile(filename);
                        const sheetNameList = workbook.SheetNames;

                        const workbookData = {};

                        sheetNameList.forEach(sheet => {
                            workbookData[generateObjectPath(sheet)] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                        });

                        set(output, generateObjectPath(filename), workbookData);
                        break;
                }
            };
        });
    }
    return output;
};

// Syncronus - Data load entry point function
function load(options = {}) {
    const { 
        path = './data',
        dataCacheKey = 'DATA_CACHE'
    } = options;
    
    let finalResult = memCache.get(dataCacheKey) || undefined;

    if (_.isUndefined(finalResult)) {
        const result = { excel: undefined };

        result.excel = loadFromExcel(path, ['.xlsx']);

        deasync.loopWhile(() => {
            if (_.isUndefined(result.excel)) {
                return true;
            } else {
                finalResult = result;
                return false;
            } 
        });
    }

    memCache.put(dataCacheKey, finalResult);
    return finalResult;
}

module.exports = { load };
