// 在字符串中找到 'a' 

function match(string){
    for(let c of string){
        if(c == "a"){
            return true;
        }
    }
    return false;
}
match("I am groot");