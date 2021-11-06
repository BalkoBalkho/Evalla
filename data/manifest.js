// const path = require('path')
const {resolve}= require('path')

module.exports = 
{
    "cpython3" :  {
        "desc": "",
        "path" : "/bin/python3",
        args    : ""
    },
    "nodejs" : {
        "desc": "",
        "path": resolve("./binaries/node"), // this file will be executed from index.js so keep that in mind
        "args": "",
    },

    "cpp": {
        desc: "",
        path: "/bin/g++",
        args: "-o",
        iscompiled: true
    },

    "perl" : {
        desc: "",
        path: "/bin/perl",
        args: ""
    }


}