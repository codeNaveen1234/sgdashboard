#!/bin/sh
set -e
tr -d '\n' |
  grep -oE '"[A-Za-z_][A-Za-z_0-9]*"\s*:\s*("[^"]*"|[0-9](\.[0-9])?|true|false|null)' |
  sed -E 's/"([^"]*)"\s*:\s*"?([^"]*)"?/\1="\2"/'