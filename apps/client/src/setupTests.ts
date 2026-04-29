// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { mockAnimationsApi } from "jsdom-testing-mocks";
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream, WritableStream, TransformStream } from "stream/web";
const crossFetch = require("cross-fetch");
const { MessagePort, MessageChannel } = require("worker_threads");

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  WritableStream,
  TransformStream,
  MessagePort,
  MessageChannel,
  fetch: crossFetch.fetch,
  Headers: crossFetch.Headers,
  Request: crossFetch.Request,
  Response: crossFetch.Response,
});

console.log("Fetch status. global.fetch is:", typeof global.fetch);

if (typeof window !== "undefined") {
  console.log("window.fetch is:", typeof window.fetch);
}

Object.assign(global, {
  MessagePort,
  MessageChannel,
});

if (typeof window !== "undefined") {
  Object.assign(window, {
    fetch: global.fetch,
    Headers: global.Headers,
    Request: global.Request,
    Response: global.Response,
    AbortController: global.AbortController,
    AbortSignal: global.AbortSignal,
    MessagePort,
    MessageChannel,
  });
}

mockAnimationsApi();

// jest.useFakeTimers();

const originalError = console.error;
(global as any).originalError = originalError;
global.console.error = (...args) => {
  if (args[0].includes("Warning: `ReactDOMTestUtils.act`")) {
    return;
  }
  originalError(...args);
};
