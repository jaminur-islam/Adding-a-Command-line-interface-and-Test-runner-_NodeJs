// ============== Dependencies ============//
const readline = require("readline");
const util = require("util");
const debug = util.debuglog();
const events = require("events");
const { processInput } = require("./test1");
class _events extends events {}
const e = new _events();
const v8 = require("v8");

//============== Container =================//
const cli = {};

//============== Check input and call function ==========//
e.on("man", (str) => {
  cli.responders.man(str);
});

e.on("exit", () => {
  process.exit(0);
});

cli.responders = {};
cli.responders.man = (str) => {
  console.log("he need a help", str);
};

//============= Process Input function ==========//
cli.processInput = (str) => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;
  const uniqInputs = [
    "man",
    "help",
    "exit",
    "stats",
    "list users",
    "more user info",
    "list checks",
    "more check info",
    "list logs",
    "more log info",
  ];

  let counter = 0;
  let notFound = false;
  if (str) {
    uniqInputs.some((input) => {
      if (str.toLowerCase().indexOf(input) > -1) {
        notFound = true;
        e.emit(input, str);
        return true;
      }
    });
  }

  if (!notFound) {
    console.log("Try Again");
  }
};

//============== Cli initialize ============//
cli.init = () => {
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "{",
  });
  _interface.prompt();

  _interface.on("line", (str) => {
    cli.processInput(str);
    _interface.prompt();
  });

  _interface.on("close", () => process.exit(0));
};

module.exports = cli;

//================= class hisab nikash ================//

/* class event {
  constructor() {
    this.input = "man";
    this.str = "man";
  }
  emit(input, str) {
    this.input = input;
    this.str = str;
  }

  on(str, callback) {
    if (str === this.input) {
      callback(str);
    }
  }
}

const e = new Home();
e.emit("man2", "man2");
e.on("man2s", (str) => {
  console.log(str);
});
e.on("sagors", (str) => {
  console.log(str);
});
j = {
  name: "sagor",
  age: 20,
};
console.log(obj);

/* const os = require("os");
console.log(os.loadavg().join(","));
console.log(os.cpus().length);
console.log(os.freemem());
console.log(os.uptime()); */
