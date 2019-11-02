import shared from '../src/index';

let sharedHost: ReturnType<typeof shared>;

beforeEach(() => {
  sharedHost = shared();
});

test('on & emit', () => {
  sharedHost.on('test-0', (payload: string) => {
    expect(payload).toBe('This is payload.');
  });

  sharedHost.emit('test-0', 'This is payload.');
});

test('once & emit', () => {
  const mockFn = jest.fn(payload => payload);

  sharedHost.once('test-1', mockFn);
  sharedHost.emit('test-1', true);
  sharedHost.emit('test-1', true);

  expect(mockFn).toReturnWith(true);
  expect(mockFn).toBeCalledTimes(1);
});

test('off', () => {
  const mockFn = jest.fn();

  sharedHost.on('test-2', mockFn);
  sharedHost.off('test-2', mockFn);
  sharedHost.emit('test-2');

  expect(mockFn).toBeCalledTimes(0);
});

test('set before get', async () => {
  sharedHost.set('test-3', 'before');
  expect(await sharedHost.get('test-3')).toBe('before');
});

test('set after get', async () => {
  setTimeout(() => {
    sharedHost.set('test-4', 'after');
  }, 0);

  expect(await sharedHost.get('test-4')).toBe('after');
});
