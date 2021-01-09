# Excel Data Loader

NodeJS based CLI app for build data json file using Excel data source

Please execute following command to install this repository as a NPM library in your project.

```sh
$ npm install hmilroy/excel-data-loader
```

Then you need to add following npm script for your project's package json file

```json
...
"load-data": "rm -rf ./data/data.json && node node_modules/excel-data-loader/index.js excel-folder-path=./data json-file-path=./data/data.json",
...
```

Please replace `./data/data.json` path from your output json file path and `./data` path from your excel file's(Input data source) folder path.
