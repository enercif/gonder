export const PACKAGE_STATUS = ['active', 'inactive', 'expired', 'expiring'] as const;
export type PackageStatus = (typeof PACKAGE_STATUS)[number];
