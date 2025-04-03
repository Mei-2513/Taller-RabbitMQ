const express = require('express');
const basicAuth = require('basic-auth');

const app = express();
app.use(express.json());
const PORT = 3000;

const requestCounts = {};

const auth = (req, res, next) => {
  const user = basicAuth(req);
  const validUser = 'admin';
  const validPass = 'password';
  if (!user || user.name !== validUser || user.pass !== validPass) {
    res.set('WWW-Authenticate', 'Basic realm="servicio-analiticas"');
    return res.status(401).send('Authentication required.');
  }
  next();
};

app.get('/analiticas-status', (req, res) => {
  res.json(requestCounts);
});

app.listen(PORT, () => {
  console.log(`api-registro listening on port ${PORT}`);
});
