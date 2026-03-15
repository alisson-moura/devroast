#!/bin/sh
set -e
node migrate.mjs
exec node .next/standalone/server.js
