type DirectoryIcons = {
  collapsed?: string;
  expanded?: string;
};

type ChevronIcons = {
  collapsed?: string;
  expanded?: string;
};

type IconDefinition = {
  path: string;
};

export type IconTheme = {
  name: string;
  appearance: "light" | "dark";
  directory_icons: DirectoryIcons;
  chevron_icons?: ChevronIcons;
  file_stems: Record<string, string>;
  file_suffixes: Record<string, string>;
  file_icons: Record<string, IconDefinition>;
};
