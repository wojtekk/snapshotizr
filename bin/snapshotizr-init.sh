#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Creating directory: ~/snapshotizr/"
mkdir -p ~/snapshotizr;

echo "Preparing example config file: ~/snapshotizr/config.js"
cp "$DIR/../examples/config.js" ~/snapshotizr/
