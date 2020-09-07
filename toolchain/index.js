let ttys = require("ttys");
let readline = require("readline");
const { resolve } = require("path");
const { rejects } = require("assert");

let stdin = ttys.stdin;
let stdout = ttys.stdout;

stdout.write("123456789\n");
stdout.write("\033[1A");
stdout.write("hello\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

void (async function () {
  console.log(await ask("What do u think of Node.js?"));
})();
