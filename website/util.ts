// Copyright 2018 Ryan Dahl <ry@tinyclouds.org>
// All rights reserved. MIT License.

const debug = false;

// tslint:disable-next-line:no-any
export function log(...args: any[]) {
  if (debug) {
    console.log.apply(null, args);
  }
}
