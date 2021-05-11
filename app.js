const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact } = require('./utils/contacts');

const app = express();
const port = 3000;

//gunakan ejs
app.set('view engine', 'ejs');

//Third-party Middleware
app.use(expressLayouts);

//Built-in Middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  // res.sendFile('./index.html', { root: __dirname });
  const mahasiswa = [
    {
      nama: 'M Afrijal Amrulah',
      email: 'afrizzaal@gmail.com',
    },
    {
      nama: 'Risal Maulana Yusup',
      email: 'risalmy@gmail.com',
    },
    {
      nama: 'M Dzikra Al-Malik',
      email: 'dzikram@gmail.com',
    },
  ];
  res.render('index', { nama: 'M Afrijal Amrulah', title: 'Halaman Home', mahasiswa, layout: 'layouts/main-layout' });
});

app.get('/about', (req, res, next) => {
  res.render('about', { layout: 'layouts/main-layout', title: 'Halaman About' });
});

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', { layout: 'layouts/main-layout', title: 'Halaman Contact', contacts });
});

app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Halaman Detail Contact',
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('<h1>404</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
