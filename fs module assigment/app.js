
const fs = require("fs");
const path = require("path");

const sourceFolder = path.join(__dirname,"source");
const destinationFolder = path.join(__dirname,"destination");

function readnonRecursive(folderPath){
    const items = fs.readdirSync(folderPath);
    console.log("read non-recursive");

    for(let i=0;i<items.length;i++){
        const itemPath=path.join(folderPath,items[i]);
        const stats = fs.statSync(itemPath);

        if(stats.isFile()){
            console.log("File:",items[i]);
        }else if(stats.isDirectory()){
            console.log("Folder:",items[i]);
        }
    }
}

function readRecursive(folderPath){
    console.log("read Recursively");

    function readFolder(currentPath){
        const items = fs.readdirSync(currentPath);

        for(let i=0;i<items.length;i++){
            const itemPath = path.join(currentPath,items[i]);
            const stats = fs.statSync(itemPath);

            if(stats.isFile()){
                console.log("File:",itemPath);
            }else if(stats.isDirectory()){
                console.log("Folder:",itemPath);
                readFolder(itemPath);
            }
        }
    }
    readFolder(folderPath);
}

function copyNonRecursive(source,destination){
    console.log("copy non-recursive");

    if(!fs.existsSync(destination)){
        fs.mkdirSync(destination);
    }

    const items = fs.readdirSync(source);

    for(let i=0;i<items.length;i++){
        const sourcePath = path.join(source,items[i]);
        const destinationPath = path.join(destination,items[i]);
        const stats = fs.statSync(sourcePath);

        if(stats.isFile()){
            fs.copyFileSync(sourcePath,destinationPath);
            console.log("Copied:",items[i]);
        }
    }
}

function copyRecursive(source,destination){
    console.log("copy recursively");
    if(!fs.existsSync(destination)){
        fs.mkdirSync(destination);
    }

    const items = fs.readdirSync(source);

    for(let i=0;i<items.length;i++){
        const sourcePath = path.join(source,items[i]);
        const destinationPath = path.join(destination,items[i]);
        const stats = fs.statSync(sourcePath);

        if(stats.isFile()){
            fs.copyFileSync(sourcePath,destinationPath);
            console.log("Copied:",sourcePath);
        }
        else if(stats.isDirectory()){
            if(!fs.existsSync(destinationPath)){
                fs.mkdirSync(destinationPath);
            }
            copyRecursive(sourcePath,destinationPath);
        }
    }
}

readnonRecursive(sourceFolder);
readRecursive(sourceFolder);
copyNonRecursive(sourceFolder,destinationFolder);
copyRecursive(sourceFolder,destinationFolder);