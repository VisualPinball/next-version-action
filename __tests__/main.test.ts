import { getNextVersion } from '../src/main';

beforeAll(async () => {
  await new Promise((r) => setTimeout(r, 2000));
});

test('should use version from package.json if no tag is available', () => {
  const nextVersion = getNextVersion('0.0.1-preview.0', []);
  expect(nextVersion).toBe('0.0.1-preview.0');
});

test('should bump version if same tag is available', () => {
  const nextVersion = getNextVersion('0.0.1-preview.0', ['0.0.1-preview.0']);
  expect(nextVersion).toBe('0.0.1-preview.1');
});

test('should bump pre-release version if same tag is available but prefixed', () => {
  const nextVersion = getNextVersion('v0.0.1-preview.0', ['0.0.1-preview.0']);
  expect(nextVersion).toBe('0.0.1-preview.1');
});

test('should bump pre-release version if same tag is available but not prefixed', () => {
  const nextVersion = getNextVersion('0.0.1-preview.0', ['v0.0.1-preview.0']);
  expect(nextVersion).toBe('0.0.1-preview.1');
});

test('should bump release version if same tag is available but prefixed', () => {
  const nextVersion = getNextVersion('v0.1.0', ['0.1.0']);
  expect(nextVersion).toBe('0.1.1');
});

test('should bump release version if same tag is available but not prefixed', () => {
  const nextVersion = getNextVersion('0.1.0', ['v0.1.0']);
  expect(nextVersion).toBe('0.1.1');
});

test('should use bump latest pre-release tag if multiple tags are available', async () => {
  const nextVersion = getNextVersion('0.0.1-preview.0', ['0.0.1-preview.1', '0.0.1-preview.0']);
  expect(nextVersion).toBe('0.0.1-preview.2');
});

test('should use bump latest tag if multiple tags are available sorted the other way around', async () => {
  const nextVersion = getNextVersion('0.0.1-preview.0', ['0.0.1-preview.0', '0.0.1-preview.1']);
  expect(nextVersion).toBe('0.0.1-preview.2');
});

test('should use bump latest tag if one tag was skipped', () => {
  const nextVersion = getNextVersion('0.0.1-preview.0', ['0.0.1-preview.2', '0.0.1-preview.10', '0.0.1-preview.0']);
  expect(nextVersion).toBe('0.0.1-preview.11');
});

test('should use major version from major package.json if no tag matched', () => {
  const nextVersion = getNextVersion('0.0.1', [
    '0.0.1-preview.3',
    '0.0.1-preview.2',
    '0.0.1-preview.1',
    '0.0.1-preview.0',
  ]);
  expect(nextVersion).toBe('0.0.1');
});

test('should use pre-release version from pre-release package.json if no tag matched', () => {
  const nextVersion = getNextVersion('0.1.0-preview.0', [
    '0.0.1',
    '0.0.1-preview.3',
    '0.0.1-preview.2',
    '0.0.1-preview.1',
    '0.0.1-preview.0',
  ]);
  expect(nextVersion).toBe('0.1.0-preview.0');
});

test('should bump final version if tag already exists and ends with 0', () => {
  const nextVersion = getNextVersion('0.2.0', [
    '0.2.0',
    '0.1.0-preview.0',
    '0.0.1',
    '0.0.1-preview.3',
    '0.0.1-preview.2',
    '0.0.1-preview.1',
    '0.0.1-preview.0',
  ]);
  expect(nextVersion).toBe('0.2.1');
});

test('should throw an error if final version is already tagged and does not end with 0', () => {
  const nextVersion = () => getNextVersion('0.2.1', ['0.2.1']);
  expect(nextVersion).toThrow(Error);
});

test('should throw an error if pre-release version is already tagged and does not end with 0', () => {
  const nextVersion = () => getNextVersion('0.2.0-preview.1', ['0.2.0-preview.1']);
  expect(nextVersion).toThrow(Error);
});

test('should throw an error for wrong versions', () => {
  expect(() => getNextVersion('xyz', [])).toThrow(Error);
  expect(() => getNextVersion('1.0', [])).toThrow(Error);
  expect(() => getNextVersion('~1.0.0', [])).toThrow(Error);
});
