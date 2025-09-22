// Shim global JS objects, hopefully this won't be necessary forever
// https://github.com/facebook/hermes/discussions/1072

import '@azure/core-asynciterator-polyfill';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { EventTarget, Event } from 'event-target-shim';
import { Buffer } from '@craftzdog/react-native-buffer';
import { Crypto } from '@peculiar/webcrypto';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.EventTarget = EventTarget;
global.Event = Event;

// Polyfill Promise.withResolvers for Hermes/older JS engines
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// AbortSignal helpers (guarded for environments where AbortSignal exists)
if (global.AbortSignal) {
  if (typeof global.AbortSignal.timeout !== 'function') {
    global.AbortSignal.timeout = (ms) => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort(new Error('Aborted'));
      }, ms);
      return controller.signal;
    };
  }
  if (!global.AbortSignal.prototype.throwIfAborted) {
    global.AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
      if (this.aborted) {
        throw new Error('Aborted');
      }
    };
  }
}

if (typeof global.CustomEvent !== 'function') {
  global.CustomEvent = class CustomEvent {
    constructor(event, params = {}) {
      this.type = event;
      this.detail = params.detail || null;
      this.bubbles = !!params.bubbles;
      this.cancelable = !!params.cancelable;
    }
  };
};


global.Buffer = Buffer;
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.subtle) {
  global.crypto.subtle = new Crypto().subtle;
}