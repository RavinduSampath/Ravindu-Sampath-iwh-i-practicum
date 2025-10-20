require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

console.log('PRIVATE_APP_ACCESS loaded:', process.env.PRIVATE_APP_ACCESS ? 'YES' : 'NO');
console.log('Token preview:', process.env.PRIVATE_APP_ACCESS?.substring(0, 10) + '...');


app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/2-174887083?properties=author,genre,book_records';
  
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data.results;
    res.render('homepage', { title: 'Homepage | IWH Practicum', data });
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching data');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Add New Book | IWH Practicum' });
});

app.post('/update-cobj', async (req, res) => {
  const { author, genre, book_records } = req.body;

  const newBook = {
    properties: {
      author,
      genre,
      book_records
    }
  };

  const url = 'https://api.hubapi.com/crm/v3/objects/2-174887083';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, newBook, { headers });
    console.log('New book created successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record');
  }
});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));
