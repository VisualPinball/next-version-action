import { promisify } from 'util';
import { readFileSync } from 'fs';
import { SemVer, rsort } from 'semver';
import gitSemVerTags from 'git-semver-tags';
import * as core from '@actions/core';

async function getTags(): Promise<string[]> {
  return await promisify(gitSemVerTags)();
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
  tags = rsort(tags);

  if (semVer === null || semVer.prerelease.length === 1) {
    throw new Error(`Invalid semver: ${version}`);
  }

  let nextVer: SemVer | null = null;

  if (!isPreRelease(semVer)) {
    if (tagsInclude(tags, semVer)) {
      if (semVer.patch > 0) {
        throw new Error(
          `Version in package.json is ${version} but tag already exists. Set patch to 0 to enable auto-increment.`,
        );
      }
      nextVer = new SemVer(tags[0]).inc('patch');
    }
  } else {
    for (const tag of tags) {
      const tagSemVer = new SemVer(tag);
      if (isSameRelease(tagSemVer, semVer)) {
        if (preReleaseNumber(semVer) > 0) {
          throw new Error(
            `Version in package.json is ${version} but tag already exists. Set pre-release to 0 to enable auto-increment.`,
          );
        }
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

function tagsInclude(tags: string[], v: SemVer): boolean {
  for (const tag of tags) {
    const vt = new SemVer(tag);
    if (vt.compare(v) === 0) {
      return true;
    }
  }
  return false;
}

function isPreRelease(semVer: SemVer): boolean {
  return semVer.prerelease.length > 0;
}

function isSameRelease(v1: SemVer, v2: SemVer): boolean {
  return v1.major === v2.major && v1.minor === v2.minor && v1.patch === v2.patch;
}

function preReleaseNumber(v: SemVer): number {
  return v.prerelease[1] as number;
}

async function run(): Promise<void> {
  try {
    const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
    core.setOutput('version', version);
    console.log(`version: ${version}`);

    const tags = await getTags();
    core.setOutput('tags', tags);
    console.log(`tags: ${tags}`);

    const nextVersion = getNextVersion(version, tags);
    const tagPrefix = core.getInput('tagPrefix') || '';
    const nextTag = tagPrefix + nextVersion;
    const isPr = isPreRelease(new SemVer(nextVersion));
    core.setOutput('nextVersion', nextVersion);
    core.setOutput('nextTag', nextTag);
    core.setOutput('isPrerelease', isPr);
    console.log(`nextVersion: ${nextVersion}`);
    console.log(`nextTag: ${nextTag}`);
    console.log(`isPrerelease: ${isPr}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
