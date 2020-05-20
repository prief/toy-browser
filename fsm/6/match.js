// 在字符串中找到 'abababx' 状态机版本


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
    if(c == "a"){
        return foundA3;
    }
    return start(c);
 }
 function foundA3(c){
    if(c == "b"){
        return foundB3;
    }
    return start(c);
 }

 function foundB3(c){
    if(c == "x"){
        return end;
    }
    return foundB2(c);
 }

 console.log(match("I aabcabx groot"))

 console.log(match("I aabcabcabx groot"))

 console.log(match("I abababx groot"))

 console.log(match("I aabababx groot"))

 console.log(match("I ababababx groot"))