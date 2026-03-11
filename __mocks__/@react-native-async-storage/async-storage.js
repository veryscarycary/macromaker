/**
 * Manual mock for @react-native-async-storage/async-storage v3.x
 * Replaces the removed jest/async-storage-mock.js that was in v1.x.
 */
'use strict';

const store = {};

const AsyncStorage = {
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(store[key] !== undefined ? store[key] : null);
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve(null);
  }),
  mergeItem: jest.fn((key, value) => {
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Object.keys(store));
  }),
  multiGet: jest.fn((keys) => {
    return Promise.resolve(keys.map((key) => [key, store[key] !== undefined ? store[key] : null]));
  }),
  multiSet: jest.fn((pairs) => {
    pairs.forEach(([key, value]) => {
      store[key] = value;
    });
    return Promise.resolve(null);
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach((key) => delete store[key]);
    return Promise.resolve(null);
  }),
  multiMerge: jest.fn(() => {
    return Promise.resolve(null);
  }),
  flushGetRequests: jest.fn(),
};

export default AsyncStorage;
