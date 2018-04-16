# Log
> :ledger: _A Node logging library that writes to stdout and stderr with colored timestamps and log levels._

I really like Ghost's [GhostLogger](https://github.com/TryGhost/Ignition/blob/master/lib/logging/GhostLogger.js),
but I don't want to import the entire library just for fancy console logging.

This is primarily a development tool. If you need serialize logs in JSON and transport to
Elasticsearch LogStash, you'll need something like Winston, Bunyan, or Pino.

The library consists of a single `Log` class that inherits from Node's `Console` class and
overrides the following methods:
  - `log`
  - `info`
  - `warn`
  - `debug`
  - `error`
  - `trace`
  - `assert`

Additionally, there is the `log.eol()` method for writing the system end-of-line character to
`stdout`.

All methods return `this`, so they can be chained.

The class is instantiated before being exported, so you don't have to. The constructor doesn't take
any options anyways.

### Installation

```bash
npm add @adamelliotfields/log
```

### Usage

```javascript
const log = require('@adamelliotfields/log');

log.log('logging!');
// [2018-04-15 19:37:37.325] logging!

log.info('information!');
// [2018-04-15 19:37:37.325]   INFO information!

log.warn('warning!');
// [2018-04-15 19:37:37.325]   WARN warning!

log.error('failure!');
// [2018-04-15 19:37:37.325]  ERROR failure!

log.debug('debugging!');
// [2018-04-15 19:37:37.325]  DEBUG debugging!

log.assert(true, 'should be true');
log.assert(false, 'should be true');
// [2018-04-15 19:37:37.325] ASSERT true should be true
// [2018-04-15 19:37:37.325] ASSERT false should be true

log.trace(new Error('message'));
// [2018-04-15 19:37:37.325]  TRACE Error: message
// [2018-04-15 19:37:37.325]        @ Object.<anonymous> (/home/afields/github/log/index.js:127:11)
// [2018-04-15 19:37:37.325]        @ Module._compile (module.js:652:30)
// [2018-04-15 19:37:37.325]        @ Object.Module._extensions..js (module.js:663:10)
// [2018-04-15 19:37:37.325]        @ Module.load (module.js:565:32)
// [2018-04-15 19:37:37.325]        @ tryModuleLoad (module.js:505:12)
// [2018-04-15 19:37:37.325]        @ Function.Module._load (module.js:497:3)
// [2018-04-15 19:37:37.325]        @ Function.Module.runMain (module.js:693:10)
// [2018-04-15 19:37:37.325]        @ startup (bootstrap_node.js:188:16)
// [2018-04-15 19:37:37.325]        @ bootstrap_node.js:609:3
```

You can also use the included middleware in Connect/Express applications.

```javascript
const express = require('express');
const http = require('http');
const { log, logMiddleware } = require('@adamelliotfields/log');

const app = express();

app.use(logMiddleware);

app.get('/', (req, res) => res.sendStatus(200));
app.get('/warn', (req, res) => res.sendStatus(400));
app.get('/error', (req, res) => res.sendStatus(500));

const server = http.createServer(app);

server.listen({ port: 8080, host: '127.0.0.1' }, () => {
  log.info('Server starting up 🎉').info('Listening on http://127.0.0.1:8080');
});

process.on('SIGINT', () => {
  server.close(() => {
    log.eol().warn('Server shutting down');
    process.exit(0);
  });
});
```

```bash
# [2018-04-15 19:37:37.325]   INFO Server starting up 🎉
# [2018-04-15 19:37:37.325]   INFO Listening on http://127.0.0.1:8080

curl localhost:8080
# OK
# [2018-04-15 19:37:37.325]   INFO GET / 200 2.995ms

curl localhost:8080/warn
# Bad Request
# [2018-04-15 19:37:37.325]   WARN GET /warn 400 1.567ms

curl localhost:8080/error
# Internal Server Error
# [2018-04-15 19:37:37.325]  ERROR GET /error 500 0.887ms

^C
# [2018-04-15 19:37:37.325]   WARN Server shutting down
```

### Alternatives

Aside from the aforementioned `GhostLogger`, [`squeak`](https://github.com/kevva/squeak) combined
with [`time-stamp`](https://github.com/jonschlinkert/time-stamp) yields very nice results.

For stack trace formatting, check out [`pretty-error`](https://github.com/AriaMinaei/pretty-error) which uses
[`renderkid`](https://github.com/AriaMinaei/RenderKid).
