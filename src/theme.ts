import type { Manifest } from "material-icon-theme";
import type { IconTheme } from "./types/icon-theme";

const keyMapping: { [key: string]: string } = {
  git: "vcs",
  console: "terminal",
  code: "json",
  coffeescript: "coffee",
  default: "file",
  storage: "database",
  template: "templ",
};

export const getTheme = (manifest: Manifest): IconTheme => {
  const transformedIconDefinitions = Object.fromEntries(
    Object.entries(manifest.iconDefinitions ?? {})
      .filter(([key]) => !key.startsWith("folder"))
      .map(([key, value]) => [
        keyMapping[key] || key, // Apply key renaming if a mapping exists
        {
          path: value.iconPath.replace(
            "./../icons/",
            "./icons/",
          ),
        },
      ]),
  );

  /**
   * Transform fileNames object to be case-insensitive
   * This is necessary because ZED's API is case-sensitive but the manifest is not
   */
  const transformedFileNames = Object.entries(manifest.fileNames ?? {}).reduce(
    (acc, [key, value]) => {
      acc[key.toLowerCase()] = value;
      acc[key.toUpperCase()] = value;
      return acc;
    },
    {} as { [key: string]: string },
  );

  return {
    name: "Material Icon Theme",
    appearance: "dark",
    file_icons: transformedIconDefinitions,
    directory_icons: {
      collapsed: "./icons/folder.svg",
      expanded: "./icons/folder-open.svg",
    },
    file_suffixes: manifest.fileExtensions ?? {},
    file_stems: transformedFileNames,
  };
};
