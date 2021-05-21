const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact, addContact, cekDuplikat } = require('./utils/contacts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

//gunakan ejs
app.set('view engine', 'ejs');

//Third-party Middleware
app.use(expressLayouts);

//Built-in Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

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
  res.render('contact', { layout: 'layouts/main-layout', title: 'Halaman Contact', contacts, msg: req.flash('msg') });
});

//Halaman Form Tambah Data Contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout',
  });
});

//Proses Data Contact
app.post(
  '/contact',
  [
    body('nama').custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error('Nama contact sudah terdaftar!');
      }
      return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // Kirimkan flash message
      req.flash('msg', 'Data contact berhasil ditambahkan!');
      res.redirect('/contact');
    }
  }
);

//Halaman Detail Contact
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
