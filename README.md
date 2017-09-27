# PCIC Climate Explorer

[![Build Status](https://travis-ci.org/pacificclimate/climate-explorer-frontend.svg?branch=master)](https://travis-ci.org/pacificclimate/climate-explorer-frontend)
[![Code Climate](https://codeclimate.com/github/pacificclimate/climate-explorer-frontend/badges/gpa.svg)](https://codeclimate.com/github/pacificclimate/climate-explorer-frontend)

Front end interface for the PCIC Climate Explorer. Node, React.js, Webpack, Babel, ES6+.

## Requirements

Node.js >= 4.0

We reccomend using [nvm](https://github.com/creationix/nvm) to manage your node/npm install.

## Deployment

In progress

## Development

Uses webpack-dev-server with hot module replacement.

### Config

Front end configuration uses environment variables.

* NODE_ENV
  * set to "production" to enable production build optimization
  * default: "development"
* CE_BACKEND_URL
  * Publicly accessible URL for backend climate data
  * Development default: http://localhost:8000/api
  * Production default: http://tools.pacificclimate.org/climate-data
* TILECACHE_URL
  * Tilecache URL for basemap layers
  * default: http://tiles.pacificclimate.org/tilecache/tilecache.py
* NCWMS_URL
  * ncWMS URL for climate layers
  * default: http://tools.pacificclimate.org/ncWMS-PCIC/wms
* CE_ENSEMBLE_NAME
  * ensemble name to use for backend requests
  * default: ce

```bash
npm install
npm start
```

### Testing

```bash
npm test
```

### Linting

Linting is configured with ESLint and largely follows the AirBnb preset.

You can lint all files `npm run lint`, or a specific file `npm run lint:glob <file_name_or_glob>`.

Use the `git/hooks/pre-commit-eslint` (and install into your .git/hooks directory) to abort a commit if any staged `*.js` files fail linting (warnings OK).

If you *really* want to skip the linting during a commit, you can always run `git commit --no-verify`. However, this is not recommended.

### Setup using Docker

```bash
git clone https://github.com/pacificclimate/climate-explorer-frontend
cd climate-explorer-frontend
```

Then build a docker image:

```bash
docker build -t pcic/climate-explorer-frontend-image .
```

You can set the environmental configuration variables each time you run the image using docker's -e flag. You probably only need to set `CE_BACKEND_URL` to point to wherever you've set up the data server, and maybe `CE_ENSEMBLE_NAME`. 


```bash
docker run -it -e "CE_BACKEND_URL=http://location.of.dataserver:dataserverport/api"
               -e "CE_ENSEMBLE_NAME=ce" 
               -p whateverexternalport:8080 
               --name climate-explorer-frontend
               climate-explorer-frontend-image
```

## Releasing

Creating a versioned release involves:

1. Incrementing `version` in `package.json`
2. Summarize the changes from the last version in `NEWS.md`
3. Commit these changes, then tag the release:

  ```bash
git add package.json NEWS.md
git commit -m"Bump to version x.x.x"
git tag -a -m"x.x.x" x.x.x
git push --follow-tags
  ```
