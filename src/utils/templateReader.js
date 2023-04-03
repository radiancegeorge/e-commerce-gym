const fs = require("fs");

/**
 *
 * @param {string} fileName
 * @param {{[key: string]: string}} fields
 */
const getTemplate = (fileName, fields) => {
  const template = fs.readFileSync("./templates/" + fileName, "utf8");
  let html = template;
  if (fields) {
    const regex = /\[[^\]]*\]/g;
    html = template.replace(regex, (found) => {
      const field = found.replace("[", "").replace("]", "");
      return fields[field] ?? found;
    });
  }
  return html;
};

module.exports = getTemplate;
