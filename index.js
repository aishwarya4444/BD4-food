const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3010;

let db;

(async () => {
  db = await open({
    filename: './BD4/database.sqlite',
    driver: sqlite3.Database,
  });
})();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

async function getAllRestaurants() {
  let query = 'SELECT * FROM restaurants ';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  let result = await getAllRestaurants();
  res.status(200).json(result);
});

async function getRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseFloat(req.params.id);
  let result = await getRestaurantById(id);
  res.status(200).json(result);
});

async function getRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine LIKE ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  let result = await getRestaurantsByCuisine(cuisine);
  res.status(200).json(result);
});

async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg LIKE ? AND hasOutdoorSeating LIKE ? AND isLuxury LIKE ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  let result = await getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
  res.status(200).json(result);
});

async function getRestaurantsSortedByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  let result = await getRestaurantsSortedByRating();
  res.status(200).json(result);
});

async function getAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  let result = await getAllDishes();
  res.status(200).json(result);
});

async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dish: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseFloat(req.params.id);
  let result = await getDishById(id);
  res.status(200).json(result);
});

async function getDishesByIsVegFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let result = await getDishesByIsVegFilter(isVeg);
  res.status(200).json(result);
});

async function getDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  let result = await getDishesSortedByPrice();
  res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
