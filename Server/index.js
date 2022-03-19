//#region requires
const { Console, assert, debug } = require("console");
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const { exit } = require("process");
//#endregion

//#region local imports
const { getHeader, getSnippets } = require("./helper.js");
//#endregion

//#region constants
// read the config file at this point!
const CONFIG = JSON.parse(fs.readFileSync("./config.json"));
console.log(CONFIG);

const INDEX = CONFIG["default-page"];
const ERR = CONFIG["404-page"];
const HOST = CONFIG["host"];
const PORT = CONFIG["port"];
const BASE = path.join(__dirname, CONFIG["base-path"]);
const SNIP = path.join(__dirname, CONFIG["snippet-path"]);
//#endregion

//#region globals

//#endregions

// server constant
const server = http.createServer((req, res) => {
  const urlData = url.parse(req.url, true);
  const urlPathName = urlData.pathname;
  const urlQuery = urlData.query;

  req.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  // error function
  const whenError = function () {
    const fourOfour = fs.readFileSync(ERR);
    res.setHeader("Content-Type", "text/html");
    res.writeHead(404);
    res.end(fourOfour);
  };

  // ga ervan uit dat het een directory is
  if (getHeader(urlPathName)[0] === "") {
    // try for a "index.html" in the directory
    try {
      let dirin = fs
        .readFileSync(path.join(BASE, urlPathName, INDEX))
        .toString();
      // check if if there are snippets
      let snippets = getSnippets(dirin);
      if (snippets !== null) {
        for (let i in snippets) {
          let snip = snippets[i].split(" ")[1];
          // open the snippet file
          try {
            const snipFile = fs
              .readFileSync(path.join(SNIP, `_${snip}.html`))
              .toString();
            dirin = dirin.replace(snippets[i], snipFile);
          } catch (err) {
            console.error(
              `ERR: snippet \"${path.join(SNIP, `_${snip}.html`)}\" not found`
            );
          }
        }
      }
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(dirin);
    } catch (err) {
      // failed, return the 404 page
      whenError();
    }
    // not a directory
  } else {
    try {
      const headerType = getHeader(urlPathName);
      if (headerType[1] === "") throw "unknown MIME-type";
      let file = fs.readFileSync(path.join(BASE, urlPathName));
      // check if the extension is html or htm
      if (headerType[0] === ".html" || headerType[0] === ".htm") {
        // convert the file to a string:
        file = file.toString();
        let snippets = getSnippets(file);
        if (snippets !== null) {
          for (let i in snippets) {
            let snip = snippets[i].split(" ")[1];
            // open the snippet file
            try {
              const snipFile = fs
                .readFileSync(path.join(SNIP, `_${snip}.html`))
                .toString();
              file = file.replace(snippets[i], snipFile);
            } catch (err) {
              console.error(
                `ERR: snippet \"${path.join(SNIP, `_${snip}.html`)}\" not found`
              );
            }
          }
        }
      }
      res.setHeader("Content-Type", headerType[1]);
      res.writeHead(200);
      res.end(file);
    } catch (err) {
      whenError();
    }
  }
  res.end();
});

// start the listening at the specified port and host
server.listen(PORT, HOST, () => {
  console.log(server.address());
  console.log(`server is listening at ${HOST}:${PORT}`);
  console.log("Server-directory: ", BASE);
  console.log("Snippet-directory: ", SNIP);
});
