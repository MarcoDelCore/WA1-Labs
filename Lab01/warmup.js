"use strict";

function modify_list_of_strings(l) {
    let result = [];
    for ( const element of l ) {
        let temp = "";
        if ( element.length === 2 ) {
            temp = element.repeat(2);
        }
        if ( element.length > 2 ) {
            temp = element.slice(0, 2) + element.slice(-2)
        }
        result.push(temp);
    }
    return result;
}

let arrayOfString = ["spring", "it", "cat", "a"];
let newArray = modify_list_of_strings(arrayOfString);
console.log(newArray)