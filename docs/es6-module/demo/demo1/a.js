require("babel-polyfill");
require("babel-register")({
  presets: ["env"],
});
import B from "./b";
console.log(B);
