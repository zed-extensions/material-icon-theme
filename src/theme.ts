import type { Manifest, IconPackValue } from "material-icon-theme";
import type { IconTheme } from "./types/icon-theme";

const keyMapping: { [key: string]: string } = {
  git: "vcs",
  code: "json",
  coffeescript: "coffee",
  default: "file",
  storage: "database",
  template: "templ",
};

const packDisplayNames: Record<string, string> = {
  "": "Material Icon Theme",
  nest: "Material Icon Theme (NestJS)",
  angular: "Material Icon Theme (Angular)",
  react: "Material Icon Theme (React)",
  vue: "Material Icon Theme (Vue)",
  angular_ngrx: "Material Icon Theme (Angular + NgRx)",
  react_redux: "Material Icon Theme (React + Redux)",
  vue_vuex: "Material Icon Theme (Vue + Vuex)",
  qwik: "Material Icon Theme (Qwik)",
  roblox: "Material Icon Theme (Roblox)",
  bashly: "Material Icon Theme (Bashly)",
};

export const getTheme = (
  manifest: Manifest,
  iconPack: IconPackValue = "",
): IconTheme => {
  const transformedIconDefinitions = Object.fromEntries(
    Object.entries(manifest.iconDefinitions ?? {}).map(([key, value]) => [
      keyMapping[key] || key, // Apply key renaming if a mapping exists
      {
        // Replace iconPath to point to the icons directory of this theme
        path: value.iconPath.replace("./../icons/", "./icons/"),
      },
    ]),
  );

  const fileIconDefinitions = Object.fromEntries(
    Object.entries(transformedIconDefinitions).filter(
      ([key]) => !key.startsWith("folder"),
    ),
  );
  const folderIconDefinitions = Object.fromEntries(
    Object.entries(transformedIconDefinitions).filter(([key]) =>
      key.startsWith("folder"),
    ),
  );

  /**
   * Transform fileNames object to be case-insensitive
   * This is necessary because ZED's API is case-sensitive but the manifest is not
   */
  const transformedFileNames = Object.entries(manifest.fileNames ?? {}).reduce(
    (acc, [key, value]) => {
      acc[key.toLowerCase()] = value;
      acc[key.toUpperCase()] = value;

      const parts = key.split(".");
      const extension = parts.pop();
      const baseName = parts.join(".");
      if (baseName && extension) {
        acc[`${baseName.toLowerCase()}.${extension.toUpperCase()}`] = value;
        acc[`${baseName.toUpperCase()}.${extension.toLowerCase()}`] = value;
      }

      // Add titlecase variant for file stems
      if (!key.startsWith(".")) {
        const titleCase =
          key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        acc[titleCase] = value;
      }

      return acc;
    },
    {} as { [key: string]: string },
  );

  const named_directory_icons: IconTheme["named_directory_icons"] = {};

  // Process folder name mappings from the manifest
  Object.entries(manifest.folderNames ?? {}).forEach(
    ([folderName, iconKey]) => {
      const collapsedIcon = folderIconDefinitions[iconKey];
      const expandedIconKey = manifest.folderNamesExpanded?.[folderName];
      const expandedIcon = expandedIconKey
        ? folderIconDefinitions[expandedIconKey]
        : collapsedIcon;

      if (collapsedIcon) {
        named_directory_icons[folderName] = {
          collapsed: collapsedIcon.path,
          expanded: expandedIcon?.path || collapsedIcon.path,
        };
      }
    },
  );

  return {
    name: packDisplayNames[iconPack] || `Material Icon Theme (${iconPack})`,
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
