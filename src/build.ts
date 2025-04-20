import { writeFileSync } from "node:fs";
import { generateManifest } from "material-icon-theme";
import { join } from "node:path";
import { getTheme } from "./theme";

const manifest = generateManifest();
const zedIconTheme = getTheme(manifest);

const zedManifest = {
  $schema: "https://zed.dev/schema/icon_themes/v0.2.0.json",
  name: "Material Icons",
  author: "Material Extensions",
  themes: [zedIconTheme],
};

writeFileSync(
  join(__dirname, "../icon_themes", "material-icons.json"),
  JSON.stringify(zedManifest, null, 2)
);

