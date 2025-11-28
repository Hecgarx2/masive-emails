const path = require('path');
const fs = require("fs");
const handlebars = require("handlebars");

function renderTemplate(templateName, context) {
  const templateDir = path.resolve(__dirname, '..', 'templates'); 
  const filePath = path.join(templateDir, `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  return template(context);
}

module.exports = { renderTemplate };