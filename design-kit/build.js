const fs = require("fs");
const path = require("path");

/////////////////////////
// Scoped Halfmoon CSS //
/////////////////////////

const scope = require("scope-css");
const csso = require("csso");

let halfmoon = fs.readFileSync(path.join(__dirname, "node_modules/halfmoon/css/halfmoon-variables.css")).toString();

// Keep the halfmoon comment.
let halfmoonComment = "";
if (halfmoon.substr(0, 2) === "/*") {
	halfmoonComment = halfmoon.substr(0, halfmoon.indexOf("The above notice must be included in its entirety when this file is used.")) +
	  "Modified by Codeberg for scoped usage with the .codeberg-design class.\n*/\n";
}

// Add .codeberg-design scope & codeberg-design- keyframes prefix.
halfmoon = scope(
	halfmoon,
	".codeberg-design",
	{
		keyframes: "codeberg-design-",
	}
);

// Fix body & html selectors.
halfmoon = halfmoon.replace(/\.codeberg-design\s+html/g, "html.codeberg-design");
halfmoon = halfmoon.replace(/\.codeberg-design\s+body/g, ".codeberg-design");
halfmoon = halfmoon.replace(/\.codeberg-design(\s*{[\s\n]*position:\s*absolute;)/g, "html.codeberg-design>body$1");

// Fix rem-based units.
// Halfmoon actually uses different values for --base-html-font-size dependent on the viewport width.
// We are using the smallest value here (used on mobile), which is 62.5%, with a base font size of 16px.
const formatPx = n => n.toFixed(3).replace(/(\.\d*[1-9]\d*)0+$|\.0+$/, "$1") + "px";
halfmoon = halfmoon.replace(/\b(\d*\.?\d+)rem\b/g, (match, value) => formatPx(value * 0.625 * 16));

// Minify CSS & add back halfmoon comment.
halfmoon = halfmoonComment + csso.minify(halfmoon).css + "\n";

let codebergCSS = halfmoon + "\n";
for (const f of fs.readdirSync(path.join(__dirname, "style")).sort()) {
	codebergCSS += "/* Codeberg Design: " + f + " */\n" + fs.readFileSync(path.join(__dirname, "style", f)).toString() + "\n";
}
fs.writeFileSync("codeberg.css", codebergCSS);

/////////////////////////////
// Build JavaScript Bundle //
/////////////////////////////

halfmoonLicense = "// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat\n"
codebergLicense = "// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt CC0\n"
licenseEnd = "// @license-end"

let codebergJS = halfmoonLicense + fs.readFileSync(path.join(__dirname, "node_modules/halfmoon/js/halfmoon.min.js")).toString() + licenseEnd + "\n\n";
for (const f of fs.readdirSync(path.join(__dirname, "script")).sort()) {
	codebergJS += codebergLicense + "/* Codeberg Design: " + f + " */\n" + fs.readFileSync(path.join(__dirname, "script", f)) + licenseEnd + "\n";
}
fs.writeFileSync("codeberg.js", codebergJS);
