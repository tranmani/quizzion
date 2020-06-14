const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.PORT || 5000

const app = express()

app.use(history())

// eslint-disable-next-line no-path-concat
app.use(serveStatic(__dirname + '/dist/spa'))
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
