require("../src/important.css");
require("../src/internet.css");
global.doTest1 = function (elmId) {
    var d = require("..");
    d.applyDecoration(elmId, "important");
}
global.doTest2 = function (elmId) {
    var d = require("..");
    d.applyDecoration(elmId, "internet");
}
