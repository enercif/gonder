export const PACKAGE_TYPES = ['send', 'receive'] as const;
export type PackageType = (typeof PACKAGE_TYPES)[number];
