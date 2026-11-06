// Prints the project's persisted design profile so every session starts aligned with it.
const fs = require("fs");
const p = ".artisan/design-profile.json";
try {
  const profile = JSON.parse(fs.readFileSync(p, "utf8"));
  console.log(
    "Artisan UI: this project has a design profile (.artisan/design-profile.json). " +
      "Follow it and .artisan/design-decisions.md for any UI work; propose profile changes instead of drifting.\n" +
      JSON.stringify(profile)
  );
} catch {} // no profile or unreadable: stay silent
