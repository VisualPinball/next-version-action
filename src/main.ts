import { promisify } from 'util';
import { readFileSync } from 'fs';
import { SemVer, rsort } from 'semver';
import gitSemVerTags from 'git-semver-tags';
import * as core from '@actions/core';

async function getSortedTags(): Promise<string[]> {
  return rsort(await promisify(gitSemVerTags)());
}

/**
 * 1. grab major, minor, patch, prerelease name, prerelease number
 * 2. if all of those 5 (or 3, if no prerelease naming) already exist as tag, grab latest and auto-increment.
 * 3. otherwise, don't increment
 *
 * TODO: throwing an error (i.e. fail build) when last number != 0 and tag already exists is okay too
 *       (e.g. 0.1.2 in package.json but 0.1.2 already exists as tag)
 */

export function getNextVersion(version: string, tags: string[]): string {
  const semVer = new SemVer(version);

  if (semVer === null || semVer.prerelease.length === 1) {
    throw new Error(`Invalid semver - ${version}`);
  }

  let nextVer: SemVer | null = null;

  if (semVer.prerelease.length === 0) {
    if (tags.includes(semVer.version)) {
      nextVer = new SemVer(tags[0]).inc('patch');
    }
  } else {
    for (const tag of tags) {
      if (tag.startsWith(semVer.version.substring(0, semVer.version.lastIndexOf('.') + 1))) {
        nextVer = new SemVer(tag).inc('prerelease');
        break;
      }
    }
  }

  if (nextVer == null) {
    nextVer = semVer;
  }

  return nextVer.version;
}

async function run(): Promise<void> {
  try {
    const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
    core.setOutput('version', version);
    console.log(`version: ${version}`);

    const tags = await getSortedTags();
    core.setOutput('tags', tags);
    console.log(`tags: ${tags}`);

    const nextVersion = getNextVersion(version, tags);
    core.setOutput('nextVersion', nextVersion);
    console.log(`nextVersion: ${nextVersion}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
