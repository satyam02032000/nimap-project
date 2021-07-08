const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const catalogs = require('./catalogs/index');
const products = require('./products/index');
const url = require('url')

// place for middleware and body parser
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


process.on('uncaughtException', err => {
  console.error("Error due to uncaught exception", err);
});

process.on('unhandledRejection', err => {
  console.error("Error due to unhandled exception", err);
});


// Catalogs endpoints
app.get('/', (req, res) => {
  refreshCatalog(req, res);
});

app.get('/catalogs', (req, res) => {
  refreshCatalog(req, res);
});

function refreshCatalog(req, res) {
  const limit = req.query['limit'] || 100;
  const pageNo = req.query['page'] || 0;
  catalogs.getAllCatalogs({ limit: limit, page: pageNo })
    .then(result => {
      res.render('catalogs.ejs', { catalogs: result });
    })
    .catch(error => console.error(error));
}

app.post('/catalogs', (req, res) => {
  catalogs.createOrReplaceCatalog(req.body)
    .then(() => {
      refreshCatalog(req, res);
    })
    .catch(error => console.error(error));
});

app.delete('/catalogs/:catalogId', (req, res) => {
  catalogs.deleteCatalogById(req.params['catalogId'])
    .then(() => {
      refreshCatalog(req, res);
    })
    .catch(error => console.error(error));
});

app.get('/catalogs/:catalogId', (req, res) => {
  catalogs.getCatalogById(req.params['catalogId'])
    .then(() => {
      refreshCatalog(req, res);
    })
    .catch(error => console.error(error));
});

// products endpoint
app.post('/products', (req, res) => {
  const myURL = url.parse(req.headers['referer'], true);
  const catalogId = myURL.query.catalogId;
  products.createOrReplaceProduct({ ...req.body, catalogId: req.body.catalogId || catalogId })
    .then(() => {
      res.redirect(`/products?catalogId=${catalogId}`);
    })
    .catch(error => console.error(error));
});

app.delete('/products/:productId', (req, res) => {
  products.deleteProductById(req.params['productId'])
    .then(() => {
      refreshProducts(req, res);
    })
    .catch(error => console.error(error));
});

app.get('/products', (req, res) => {
  refreshProducts(req, res);
});

function refreshProducts(req, res) {
  const limit = req.query['limit'] || 2;
  const pageNo = req.query['page'] || 0;
  
  if (req.query['catalogId']) {
    products.getProductByCatalogId(req.query['catalogId'], { limit: limit, page: pageNo })
      .then(result => {
        res.render('products.ejs', { products: result });
      })
      .catch(error => console.error(error));
  } else {
    products.getAllProducts({ limit: limit, page: pageNo })
      .then(result => {
        res.render('products.ejs', { products: result });
      })
      .catch(error => console.error(error));
  }
}

app.listen(3001, function () {
  console.log('listening on 3001');
});
