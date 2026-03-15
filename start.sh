#!/bin/sh
set -e
node migrate.mjs
exec node_modules/.bin/next start
