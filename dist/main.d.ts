/**
 * 1. grab major, minor, patch, prerelease name, prerelease number
 * 2. if all of those 5 (or 3, if no prerelease naming) already exist as tag, grab latest and auto-increment.
 * 3. otherwise, don't increment
 */
export declare function getNextVersion(version: string, tags: string[]): string;
export declare function run(): Promise<void>;
