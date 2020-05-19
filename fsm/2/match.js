// 在字符串中找到 'ab' 

function match(string){
    let foundA = false;
    for(let c of string){
        if(c == "a"){
            foundA = true;
        }else if(foundA && c == "b"){
            return true
        }else{
            foundA = false;
        }
    }
    return false;
}
match("I am groot");
match("I acbm groot");
match("I abm groot");