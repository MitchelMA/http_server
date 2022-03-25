const fs = require("fs");
const { get } = require("http");
const path = require("path");

// returns an array:
// 0: extension
// 1: MIME-type
exports.getHeader = function (url) {
  // regex expression to get the extension
  let expression = /(?:\.([^.]+))?$/;
  // get the extension
  let ext = expression.exec(url);
  let type = "";
  // icon format
  type = MIME_TYPES[ext[0]];
  return [ext[0], type];
};
// https://www.iana.org/assignments/media-types/media-types.xhtml
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const MIME_TYPES = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/x-freearc",
  ".avif": "image/avif",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bmp": "image/bmp",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
  ".cda": "application/x-cdf",
  ".csh": "application/x-csh",
  ".css": "text/css",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".eot": "application/vnd.ms-fontobject",
  ".epub": "application/epub+zip",
  ".gz": "application/gzip",
  ".gif": "image/gif",
  ".htm": "text/html",
  ".html": "text/html",
  ".ico": "image/vnd.microsoft.icon",
  ".ics": "text/calendar",
  ".jar": "application/jar-archive",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jsonld": "application/ld+json",
  ".mid": "audio/midi",
  ".mjs": "text/javascript",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".mpkg": "application/vnd.apple.installer+xml",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".ogx": "application/ogg",
  ".opus": "audio/opus",
  ".otf": "font/otf",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".php": "application/x-httpd-php",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".rar": "application/vnd.rar",
  ".rtf": "application/rtf",
  ".sh": "application/x-sh",
  ".svg": "image/svg+xml",
  ".swf": "application/x-shockwave-flash",
  ".tar": "application/x-tar",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ts": "video/mp2t",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".vsd": "application/vnd.visio",
  ".wav": "audio/wav",
  ".weba": "audio/weba",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml": "application/xml",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip",
  ".7z": "application/x-7z-compressed",
};

// to get the snippet variables in the html
getSnippets = function (filestring) {
  let expression = /%s\s([\w\/]+)\s%s/g;
  let snips = filestring.match(expression);

  return snips;
};

// to convert the snippets
// this method returns the file with the replaced text
/**
 *
 * @param {string} file the file of which the snippets need to be replaced
 */
exports.replaceSnippets = function (fileString, basePath) {
  if (!(typeof fileString === "string")) {
    throw new Error("Filestring is not a string");
  }
  if (basePath === null) {
    throw new Error("No base-path was given");
  }

  // get the snippets
  let snips;
  try {
    snips = [...getSnippets(fileString)];
  } catch (err) {
    // early return if there are no snippets present in the file
    return fileString;
  }

  let snipslocations = [];
  for (let i in snips) {
    snipslocations.push(snips[i].split(" ")[1]);
  }

  for (let i in snipslocations) {
    // check if "/" is in the snippet as a path-divider
    if (snipslocations[i].includes("/")) {
      // if this is the case, only adjust the last
      snipslocations[i] = snipslocations[i].split("/");
      snipslocations[i][snipslocations[i].length - 1] = `_${
        snipslocations[i][snipslocations[i].length - 1]
      }`;
      snipslocations[i] = snipslocations[i].join("/");
    } else {
      snipslocations[i] = `_${snipslocations[i]}`;
    }

    // try to open the snippet file
    try {
      const snipFile = fs
        .readFileSync(path.join(basePath, `${snipslocations[i]}.html`))
        .toString();
      fileString = fileString.replace(snips[i], snipFile);
    } catch (err) {
      console.error(
        `ERR: snippet \"${path.join(
          basePath,
          `${snipslocations[i]}.html`
        )}\" not found`
      );
    }
  }
  return fileString;
};
