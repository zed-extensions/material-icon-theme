import { writeFileSync } from "node:fs";
import { generateManifest } from "material-icon-theme";
import { join } from "node:path";
import { getTheme } from "./theme";
import fs from "node:fs";

const manifest = generateManifest();
const zedIconTheme = getTheme(manifest);

const zedManifest = {
  $schema: "https://zed.dev/schema/icon_themes/v0.2.0.json",
  name: "Material Icon Theme",
  author: "Zed Industries",
  themes: [zedIconTheme],
};

writeFileSync(
  join(__dirname, "../icon_themes", "material-icon-theme.json"),
  JSON.stringify(zedManifest, null, 2),
);

// Copy icons from node_modules to the icons directory
const iconsSourceDir = join(
  __dirname,
  "../node_modules/material-icon-theme/icons",
);
const iconsDestDir = join(__dirname, "../icons");
if (!fs.existsSync(iconsDestDir)) {
  fs.mkdirSync(iconsDestDir, { recursive: true });
}
fs.readdirSync(iconsSourceDir).forEach((file) => {
  const sourceFile = join(iconsSourceDir, file);
  const destFile = join(iconsDestDir, file);
  fs.copyFileSync(sourceFile, destFile);
});
console.log("Material Icon Theme icons copied successfuly.");
