let o = [
    {
        "id": 1,
        "name": "xxx",
        "mark": "x1x1x1"
    },
    {
        "id": 2,
        "name": "xxx",
        "mark": "x2x2x2"
    },
    {
        "id": 3,
        "name": "yyy",
        "mark": "y1y1y1"
    },
    {
        "id": 4,
        "name": "XXX",
        "mark": "z1z1z1"
    }
]
let n = o.length;
let name = [];
let id = [];
let searchName = "xxX";
let pattern = new RegExp(searchName, "i");
for(let i = 0; i < n; i++) {
    o[i].name.search(pattern) >= 0 ? id.push(o[i].id) : "";
}

console.log(`Name = ${searchName} ID found = ${id}`);

let a = "2";

if(a.length  == 1) {
    a = "0" + a;
}
console.log(a);