const http = require("http");

const server = http.createServer((req,res)=>{
    console.log("server received a request");
    console.log(req.headers);
    
    res.setHeader("Content-Type","text/html");
    res.setHeader("X-Foo","bar");
    res.writeHead(200,{"Content-Type":"text/plain"});
    let result = '';
    for(var i =0;i<65536;i++){
        result+="a";
    }
    res.end(result);
})

server.listen(8080,()=>{
    console.log("server is running...")
})