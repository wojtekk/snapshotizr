# Snapshotizr

Snapshot creates a diff for each project modified by your team members on Github.

## Setup

Install and initialise snapshotizr:

    npm install -g snapshotizr
    snapshotizr-init

Create a github token with scope: `repo` and edit configuration file: `~/snapshotizr/config.js`.

Enjoy! :)

## Working directory

Snapshotizr uses directory: `~/snapshotizr/`.

## Usage

Just run:

    snapshotizr

Available options:

* `--month, -m` - month number (1-12), default value: previous month
* `--skip-cleanup, -s` - don't remove directory with repositories (for debugging)

## Limitations

Github provides only last 100 public events performed by a user (event == push, not commit). So in the specific
situation, you can lose some repos.
