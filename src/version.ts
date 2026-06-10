const parseMajorVersion = (version: string): number => {
  const match = version.match(/^v?(\d+)(?:\.|$)/);

  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  return Number.parseInt(match[1], 10);
};

export const isMajorVersionUpgrade = (
  currentVersion: string,
  targetVersion: string,
): boolean => {
  return parseMajorVersion(targetVersion) > parseMajorVersion(currentVersion);
};
