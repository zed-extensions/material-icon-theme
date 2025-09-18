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
    Object.entries(manifest.iconDefinitions ?? {}).map(([key, value]) => [
      keyMapping[key] || key, // Apply key renaming if a mapping exists
      {
        // Replace iconPath to point to the icons directory of this theme
        path: value.iconPath.replace("./../icons/", "./icons/"),
      },
    ])
  );

  const fileIconDefinitions = Object.fromEntries(
    Object.entries(transformedIconDefinitions).filter(
      ([key]) => !key.startsWith("folder")
    )
  );
  const folderIconDefinitions = Object.fromEntries(
    Object.entries(transformedIconDefinitions).filter(([key]) =>
      key.startsWith("folder")
    )
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

  const named_directory_icons: IconTheme["named_directory_icons"] = {};

  // Process folder name mappings from the manifest
  Object.entries(manifest.folderNames ?? {}).forEach(([folderName, iconKey]) => {
    const collapsedIcon = folderIconDefinitions[iconKey];
    const expandedIconKey = manifest.folderNamesExpanded?.[folderName];
    const expandedIcon = expandedIconKey ? folderIconDefinitions[expandedIconKey] : collapsedIcon;

    if (collapsedIcon) {
      named_directory_icons[folderName] = {
        collapsed: collapsedIcon.path,
        expanded: expandedIcon?.path || collapsedIcon.path,
      };
    }
  });

  return {
    name: "Material Icon Theme",
    appearance: "dark",
    file_icons: fileIconDefinitions,
    directory_icons: {
      collapsed: "./icons/folder.svg",
      expanded: "./icons/folder-open.svg",
    },
    named_directory_icons,
    file_suffixes: manifest.fileExtensions ?? {},
    file_stems: transformedFileNames,
  };
};
