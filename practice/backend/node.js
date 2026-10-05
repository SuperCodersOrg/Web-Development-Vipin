const http = require("http");
const fs = require("fs");
const path=require("path");

const frontendpath = path.join(__dirname,'..','frontend','index.html');
const datapath = path.join(__dirname,'data','data.json');

const product=JSON.parse(fs.readFileSync(datapath));

const server = http.createServer((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");

    if(req.method==='OPTIONS'){
      res.writeHead(200);
      res.end();
      return;
    }


const url = new URL(req.url,`http://${req.headers.host}`);
console.log(url);
console.log(req.headers.host);
console.log(req.url);


if(url.pathname === "/products"){
    let result = [...product];

    const searchvalue = url.searchParams.get("searchValue");
    const category = url.searchParams.get("category");

    if(searchvalue){
        result = result.filter(item =>
            item.name.toLowerCase().includes(searchvalue.toLowerCase())
        );
    }

    if(category){
        result = result.filter(item =>
            item.category.toLowerCase() === category.toLowerCase()
        );
    }

    console.log(result);

    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(result));

    return;

}
});

server.listen(3200,()=>{
  console.log("server is running on port 3200");
});