// 在字符串中找到 'abcabx' 状态机版本


function match(string){
    let state = start;
    for(let c of string){
        state = state(c)
    }
    return state === end;
}

function start(c){
    if(c == "a"){
        return foundA;
    }
    return start; // 状态不变
 }

 function end(c){
     return end;
 }

 function foundA(c){
    if(c == "b"){
        return foundB;
    }
    return start(c);
 }
 function foundB(c){
    if(c == "c"){
        return foundC;
    }
    return start(c);
 }
 function foundC(c){
    if(c == "a"){
        return foundA2;
    }
    return start(c);
 }
 function foundA2(c){
    if(c == "b"){
        return foundB2;
    }
    return start(c);
 }
 function foundB2(c){
    if(c == "x"){
        return end;
    }
    return foundB(c);
 }

 console.log(match("I abcdef groot"))
 
 console.log(match("I aabcdef groot"))

 console.log(match("I abcabx groot"))

 console.log(match("I aabcabx groot"))

 console.log(match("I aabcabcabx groot"))

