//========= Dependencies =============//
const readline = require("readline");
const util = require("util");
const debug = util.debuglog();
const event = require("events");
class _events extends event {}
const e = new _events();
const os = require("os");
const v8 = require("v8");
//======== Container ============//
const cli = {};
// Input handlers
e.on("man", function (str) {
  cli.responders.help();
});

e.on("help", function (str) {
  cli.responders.help();
});

e.on("exit", function (str) {
  cli.responders.exit();
});

e.on("stats", function (str) {
  cli.responders.stats();
});

e.on("list users", function (str) {
  cli.responders.listUsers();
});

e.on("more user info", function (str) {
  cli.responders.moreUserInfo(str);
});

e.on("list checks", function (str) {
  cli.responders.listChecks(str);
});

e.on("more check info", function (str) {
  cli.responders.moreCheckInfo(str);
});

e.on("list logs", function () {
  cli.responders.listLogs();
});

e.on("more log info", function (str) {
  cli.responders.moreLogInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function () {
  const commands = {
    exit: "Kill the CLI (and the rest of the application)",
    man: "Show this help page",
    help: 'Alias of the "man" command',
    stats:
      "Get statistics on the underlying operating system and resource utilization",
    "List users":
      "Show a list of all the registered (undeleted) users in the system",
    "More user info --{userId}": "Show details of a specified user",
    "List checks --up --down":
      'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
    "More check info --{checkId}": "Show details of a specified check",
    "List logs":
      "Show a list of all the log files available to be read (compressed and uncompressed)",
    "More log info --{logFileName}": "Show details of a specified log file",
  };
  // Show a header for the help page that is as width as the screen
  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      let value = commands[key];
      let line = "\x1b[33m" + key + "\x1b[0m";
      let padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line = line + " ";
      }
      line = line + value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);
  cli.horizontalLine();
};

// Create vertical space function
cli.verticalSpace = (lines) => {
  lines = typeof lines === "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

// Create a horizontal line across thew screen
cli.horizontalLine = () => {
  // Get the available screen size
  const width = process.stdout.columns;
  let line = "";
  for (i = 0; i < width; i++) {
    line = line + "-";
  }
  console.log(line);
};

// Create centered text on the screen
cli.centered = (str) => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;

  // get the available screen size
  const width = process.stdout.columns;
  // Calculate the left padding there should be
  const leftPadding = Math.floor((width - str.length) / 2);
  let line = "";
  for (i = 0; i < leftPadding; i++) {
    line += "";
  }
  line += str;

  console.log(line);
};

// Exit
cli.responders.exit = function () {
  process.exit(0);
};

// Stats
cli.responders.stats = function () {
  var stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)": Math.round(
      (v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size) *
        100
    ),
    "Available Heap Allocated (%)": Math.round(
      (v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit) *
        100
    ),
    Uptime: os.uptime() + " Seconds",
  };

  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (let key in stats) {
    if (stats.hasOwnProperty(key)) {
      let value = stats[key];
      let line = "\x1b[33m" + key + "\x1b[0m";
      let padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line = line + " ";
      }
      line = line + value;
      console.log(line);
      cli.verticalSpace();
    }
  }
};

// List Users
cli.responders.listUsers = function () {
  console.log("You asked to list users");
};

// More user info
cli.responders.moreUserInfo = function (str) {
  console.log("You asked for more user info", str);
};

// List Checks
cli.responders.listChecks = function () {
  console.log("You asked to list checks");
};

// More check info
cli.responders.moreCheckInfo = function (str) {
  console.log("You asked for more check info", str);
};

// List Logs
cli.responders.listLogs = function () {
  console.log("You asked to list logs");
};

// More logs info
cli.responders.moreLogInfo = function (str) {
  console.log("You asked for more log info", str);
};

//==== Process input function ======//
cli.processInput = (str) => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;
  let uniqInputs = [
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

  let notFound = false;
  if (str) {
    uniqInputs.some((input) => {
      if (str.toLowerCase().indexOf(input) > -1) {
        notFound = true;
        e.emit(str, input);
        return true;
      }
    });
  }
  if (!notFound) {
    console.log("Sorry, Try again please");
  }
};

//======== Cli Init ============//
cli.init = () => {
  console.log("\x1b[34m%s", "Cli is start now");
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });

  _interface.prompt();

  _interface.on("line", (str) => {
    // Call processInput function
    cli.processInput(str);
    _interface.prompt();
  });
  _interface.on("close", () => process.exit(0));
};

module.exports = cli;
