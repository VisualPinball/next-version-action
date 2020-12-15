import { getNextVersion } from '../src/main';

const VPE_VERSIONING = [
  { version: '0.0.1-preview.0', tags: [], nextVersion: '0.0.1-preview.0' },
  {
    version: '0.0.1-preview.0',
    tags: ['0.0.1-preview.0'],
    nextVersion: '0.0.1-preview.1',
  },
  {
    version: '0.0.1-preview.0',
    tags: ['0.0.1-preview.1', '0.0.1-preview.0'],
    nextVersion: '0.0.1-preview.2',
  },
  {
    version: '0.0.1-preview.0',
    tags: ['0.0.1-preview.2', '0.0.1-preview.1', '0.0.1-preview.0'],
    nextVersion: '0.0.1-preview.3',
  },
  {
    version: '0.0.1',
    tags: ['0.0.1-preview.3', '0.0.1-preview.2', '0.0.1-preview.1', '0.0.1-preview.0'],
    nextVersion: '0.0.1',
  },
  {
    version: '0.1.0-preview.0',
    tags: ['0.0.1', '0.0.1-preview.3', '0.0.1-preview.2', '0.0.1-preview.1', '0.0.1-preview.0'],
    nextVersion: '0.1.0-preview.0',
  },
  {
    version: '0.2.0',
    tags: ['0.1.0-preview.0', '0.0.1', '0.0.1-preview.3', '0.0.1-preview.2', '0.0.1-preview.1', '0.0.1-preview.0'],
    nextVersion: '0.2.0',
  },
  {
    version: '0.2.1-preview.0',
    tags: [
      '0.2.0',
      '0.1.0-preview.0',
      '0.0.1',
      '0.0.1-preview.3',
      '0.0.1-preview.2',
      '0.0.1-preview.1',
      '0.0.1-preview.0',
    ],
    nextVersion: '0.2.1-preview.0',
  },
];

beforeAll(async () => {
  await new Promise((r) => setTimeout(r, 2000));
});

test('VPE Versioning #1', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[0].version, VPE_VERSIONING[0].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[0].nextVersion);
});

test('VPE Versioning #2', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[1].version, VPE_VERSIONING[1].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[1].nextVersion);
});

test('VPE Versioning #3', async () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[2].version, VPE_VERSIONING[2].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[2].nextVersion);
});

test('VPE Versioning #4', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[3].version, VPE_VERSIONING[3].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[3].nextVersion);
});

test('VPE Versioning #5', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[4].version, VPE_VERSIONING[4].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[4].nextVersion);
});

test('VPE Versioning #6', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[5].version, VPE_VERSIONING[5].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[5].nextVersion);
});

test('VPE Versioning #7', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[6].version, VPE_VERSIONING[6].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[6].nextVersion);
});

test('VPE Versioning #8', () => {
  var nextVersion = getNextVersion(VPE_VERSIONING[7].version, VPE_VERSIONING[7].tags);
  expect(nextVersion).toBe(VPE_VERSIONING[7].nextVersion);
});
