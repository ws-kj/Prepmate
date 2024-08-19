# Prepmate

A recreation of Collegeboard's SAT Bluebook software for MLS Educational Consultants.

## Source code

Front-end code is contained in `src/renderer/`

Application configuration and code for IPC events (such as reading/writing files from disk) can be found in `src/main` 

## Build instructions

Prepmate requires node.js/npm and `electron-forge`.


To start in development mode: `npm start`

To build for linux: `npm run package`

To build for windows: `npm run winbuild`

To build for mac: `npm run macbuild`

Build outputs can be found in `release/build/`

For further build help, check the `electron-forge` docs.
