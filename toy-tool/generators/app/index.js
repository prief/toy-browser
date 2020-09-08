var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  collecting() {
    this.log("collecting");
  }
  creating() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { title: "templating with yeoman" }
    );
    this.fs.copyTpl(
      this.templatePath("createElement.js"),
      this.destinationPath("lib/createElement.js")
    );
    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js")
    );
    this.npmInstall(
      [
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "@babel/core",
        "@babel/preset-env",
        "@babel/plugin-transform-react-jsx",
        "babel-loader",
        "mocha",
        "nyc",
        "@istanbuljs/nyc-config-babel",
        "babel-plugin-istanbul",
      ],
      {
        "save-dev": true,
      }
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("public/index.html"),
      { title: "templating with yeoman" }
    );
  }
};
