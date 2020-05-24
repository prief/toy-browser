const net = require("net");
const images = require("images");
const render = require("./render.js");
const parser = require("./parser.js");

class Request {
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host || "localhost";
        this.port = options.port || 8080;
        this.path = options.path || "/";
        this.headers = options.headers || {};
        this.body = options.body || {};

        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }

        if(this.headers["Content-Type"] == "application/json"){
            this.bodyText = JSON.stringify(this.body)
        }else if(this.headers["Content-Type"] =="application/x-www-form-urlencoded"){
            this.bodyText = Object.keys(this.body).map(k=>encodeURIComponent(k) +"="+encodeURIComponent(this.body[k])).join("&")
        }
        this.headers["Content-Length"] = this.bodyText.length;

    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(k=>`${k}: ${this.headers[k]}`).join("\r\n")}\r
\r
${this.bodyText}`
    }

    send(conn){
        return new Promise((res,rej)=>{
            let parser = new ResponseParser();
            if(conn){
                conn.write(this.toString())
            }else{
                conn = net.createConnection({
                    host:this.host,
                    port:this.port
                },()=>{
                    conn.write(this.toString())
                })
            }

            conn.on("data",(data)=>{
                console.log("--->",data.toString().length)
                console.log(data.toString())
                parser.receive(data.toString());

                if(parser.isFinished){
                    res(parser.response)
                }

                // console.log(parser.statusLine);
                // console.log(parser.headers);
                // res(data.toString())
                conn.end();
            })
            conn.on("end",()=>{
                console.log("disconnected from server")
            })
            conn.on("error",(error)=>{
                rej(error);
                conn.end();
            })
        })
        
    }   
}

class ResponseParser {
    constructor(){
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BOBY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";

        this.bodyParser = null;
    }

    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }
     
    get response(){
        this.statusLine.match(/HTTP\/1.1 (\d+) ([\s\S]+)/);
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join("")
        };
    }

    receive(string){
        for(let i = 0;i<string.length;i++){
            this.receiveChar(string.charAt(i));
        }
    }

    receiveChar(char){
        if(this.current == this.WAITING_STATUS_LINE){
            if(char === "\r"){
                this.current =  this.WAITING_STATUS_LINE_END;
            }else{
                this.statusLine += char;
            }
        }else if(this.current ==  this.WAITING_STATUS_LINE_END){
            if(char === "\n"){
                this.current =  this.WAITING_HEADER_NAME;
            }
        }else if(this.current ==  this.WAITING_HEADER_NAME){
            if(char =="\r"){
                this.current = this.WAITING_HEADER_BLOCK_END;
                if(this.headers["Transfer-Encoding"] === "chunked"){
                    this.bodyParser = new TrunkedBodyParser();
                }
            }else if(char == ":"){
                this.current = this.WAITING_HEADER_SPACE;
            }else{
                this.headerName += char;
            }
        }else if(this.current == this.WAITING_HEADER_SPACE){
            if(char == " "){
                this.current = this.WAITING_HEADER_VALUE;
            }
        }else if(this.current == this.WAITING_HEADER_VALUE){
            if(char == "\r"){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            }else{
                this.headerValue += char;
            }
        }else if( this.current == this.WAITING_HEADER_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if(this.current == this.WAITING_HEADER_BLOCK_END){
            if(char === "\n"){
                this.current = this.WAITING_BOBY;
            }
        }else if(this.current  == this.WAITING_BOBY){
            this.bodyParser.receiveChar(char)
        }
    }
}

class TrunkedBodyParser {
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END =4;

        this.length = 0;
        this.content = [];
        this.isFinished = false;

        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char){
        // console.log(JSON.stringify(char))
        if(this.current == this.WAITING_LENGTH){
            if(char == "\r"){
                console.log(this.length)
                if(this.length == 0){
                    // console.log(this.content)
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            }else{
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        }else if(this.current == this.WAITING_LENGTH_LINE_END){
            if(char == "\n"){
                this.current = this.READING_TRUNK
            }
        }else if(this.current == this.READING_TRUNK){
            if(this.length >0){
                this.content.push(char);
            }
            this.length--;
            if(this.length ==0 ){
                this.current = this.WAITING_NEW_LINE;
            }
        }else if(this.current == this.WAITING_NEW_LINE){
            if(char == "\r"){
                this.current = this.WAITING_NEW_LINE_END;
            }
        }else if(this.current == this.WAITING_NEW_LINE_END){
            if(char == "\n"){
                this.current = this.WAITING_LENGTH;
            }
        }



    }

}


void async function(){
    let request = new Request({
        method:"GET",
        host:"localhost",
        port:8080,
        path:"/",
        headers:{
            "geek":"time"
        },
        body:{
            name:"GeekTime"
        }
    })
    let res = await request.send();
    // console.log(res);
    let dom = parser.parseHTML(res.body)
    console.log(dom);

    let viewport = images(800,600);
    render(viewport,dom);
    viewport.save("viewport.jpg")
}();

// const client = net.createConnection({
//     host:"localhost",
//     port:8080
// },()=>{
//     console.log("connected to server");
//     // client.write("GET / HTTP/1.1\r\n");
//     // client.write("\r\n")

//     let request = new Request({
//         method:"GET",
//         host:"localhost",
//         port:8080,
//         path:"/",
//         headers:{
//             "geek":"time"
//         },
//         body:{
//             name:"GeekTime"
//         },

//     })

//     console.log(request.toString())
//     client.write(request.toString())
// })

// client.on("data",(data)=>{
//     console.log("on data==",data.toString().length)
//     // for(var i = 0;i<data.toString().length;i++){
//     //     console.log(data.toString()[i].codePointAt().toString(16))
//     // }
    
//     // client.end();
// })
// client.on("end",()=>{
//     console.log("disconnected from server")
// })
