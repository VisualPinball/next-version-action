import { promisify } from 'util';
import { readFileSync } from 'fs';
import { SemVer, rsort, neq } from 'semver';
import gitSemVerTags from 'git-semver-tags';
import * as core from '@actions/core';

async function getTags(): Promise<string[]> {
  return await promisify(gitSemVerTags)();
}

/**
 * 1. grab major, minor, patch, prerelease name, prerelease number
 * 2. if all of those 5 (or 3, if no prerelease naming) already exist as tag, grab latest and auto-increment.
 * 3. otherwise, don't increment
 */

export function getNextVersion(version: string, tags: string[]): string {
  const semVer = new SemVer(version);
  tags = rsort(tags);

  if (semVer === null || semVer.prerelease.length === 1) {
    throw new Error(`Invalid semver: ${version}`);
  }

  let nextVer: SemVer | null = null;

  if (!isPrerelease(semVer)) {
    if (tagsInclude(tags, semVer)) {
      nextVer = new SemVer(tags[0]).inc('patch');
    }
  } else {
    for (const tag of tags) {
      const tagSemVer = new SemVer(tag);
      if (isSameRelease(tagSemVer, semVer)) {
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

function isPrerelease(semVer: SemVer): boolean {
  return semVer.prerelease.length > 0;
}

function isSameRelease(v1: SemVer, v2: SemVer): boolean {
  return v1.major === v2.major && v1.minor === v2.minor && v1.patch === v2.patch;
}

function isBump(v1: SemVer, v2: SemVer): boolean {
  return neq(v1, v2);
}

async function run(): Promise<void> {
  try {
    const path = core.getInput('path') || '.';
    
    const version = JSON.parse(readFileSync(`${path}/package.json`, 'utf8')).version;
    core.setOutput('version', version);
    console.log(`version: ${version}`);

    const tags = await getTags();
    core.setOutput('tags', tags);
    console.log(`tags: ${tags}`);

    const nextVersion = getNextVersion(version, tags);
    core.setOutput('nextVersion', nextVersion);
    console.log(`nextVersion: ${nextVersion}`);

    const tagPrefix = core.getInput('tagPrefix') || '';
    const nextTag = tagPrefix + nextVersion;
    core.setOutput('nextTag', nextTag);
    console.log(`nextTag: ${nextTag}`);

    const isBm = isBump(new SemVer(version), new SemVer(nextVersion));
    core.setOutput('isBump', isBm);
    console.log(`isBump: ${isBm}`);

    const isPr = isPrerelease(new SemVer(nextVersion));
    core.setOutput('isPrerelease', isPr);
    console.log(`isPrerelease: ${isPr}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
