const fs = require("node:fs");
const data = JSON.parse(fs.readFileSync("biome-errors.json", "utf8"));
const errors = data.diagnostics || [];
const summary = {};
errors.forEach((e) => {
  const code = e.category;
  summary[code] = summary[code] || [];
  summary[code].push(e.location?.path);
});
console.log(
  JSON.stringify(
    Object.keys(summary).map((k) => ({
      code: k,
      count: summary[k].length,
      sampleFiles: summary[k].slice(0, 3),
    })),
    null,
    2,
  ),
);
