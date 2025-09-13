type DirectoryIcons = {
  collapsed?: string;
  expanded?: string;
};

type NamedDirectoryIcons = {
  [key: string]: DirectoryIcons;
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
  named_directory_icons: NamedDirectoryIcons;
  chevron_icons?: ChevronIcons;
  file_stems: Record<string, string>;
  file_suffixes: Record<string, string>;
  file_icons: Record<string, IconDefinition>;
};
