'use strict';
var fs = require('fs'),
    path = require('path'),
    archiver = require('archiver'),
    currDate = new Date(),
    year = currDate.getFullYear(),
    month = currDate.toLocaleString("en-us", { month: "long" }),
    dir = path.join(__dirname + '/archive/' + year + '/' + month),
    ignoredFile = currDate.getFullYear()+'-'+('0' + (currDate.getMonth() + 1)).slice(-2)+'-'+('0' + currDate.getDate()).slice(-2)+'.log';




//Function to create directories recursively
exports.createDir = function (dir) {
    const splitPath = dir.split('/');
    splitPath.reduce(function (dirPath, subPath) {
        let currentPath;
        if (subPath != '.') {
            currentPath = dirPath + '/' + subPath;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
        } else {
            currentPath = subPath;
        }
        return currentPath
    }, '');
};
exports.createDir(dir);

var output = fs.createWriteStream(path.join(dir, 'logs.zip'));
var archive = archiver('zip', {});
var logPath = __dirname + '/logs';


output.on('close', function () {
    if (fs.existsSync(logPath)) {
        fs.readdirSync(logPath).forEach(function (file, index) {
            var curPath = logPath + "/" + file;
            if (!fs.lstatSync(logPath).isFile()) {
                // delete file
                if(!(file == 'ETP.log')) {
                    fs.unlinkSync(curPath);
                }
            }
        });
    }
});

output.on('end', function () {
    console.log('Data has been drained');
});

//archive.glob("**/*",{"ignore":['ETP.log']});
//archive.glob("*!*ETP.log");

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.log(err);
    } else {
        // throw error
        console.log(err);
        throw err;
    }
});

archive.on('error', function (err) {
    logger.error(err);
    throw err;
});
//var d = new Date(currDate);
//var filename = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'.log'
archive.pipe(output);
//archive.directory(__dirname + '/logs', '');
archive.glob('**/*', { ignore: __dirname + '/logs/ETP.log', nodir: false }).finalize();
// archive.finalize(function (err, bytes) {
//     if (err)
//         throw err;
//     logger.info('done:', bytes);
// });


