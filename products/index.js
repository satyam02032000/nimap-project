var db = require("../database/db");
var moment = require('moment');
var uuid = require('uuid');

// pg library caches query to so no need to write prepare statement
async function createOrReplaceProduct(product) {
  const text = `INSERT INTO products(id, name, description, catalog_id, created_at) VALUES($1, $2, $3, $4, $5)
    on conflict(id) do update set name = $2, description = $3, created_at = $5
    RETURNING *`;
  const values = [product.id || uuid.v4(), product.name, product.description, product.catalogId, moment().toISOString()];
  await db.client.query(text, values);
}

async function deleteProductById(productId) {
  const text = `delete from products where id=$1`;
  await db.client.query(text, [productId]);
}

async function getAllProducts(pagination) {
  // default page rules
  pagination = {
    limit: 2,
    page: 0,
    ...pagination,
  };
  const text = `select * from products order by id limit $1 offset $2`;
  var res = await db.client.query(text, [pagination.limit, pagination.page * pagination.limit]);
  return res.rows;
}

async function getProductByCatalogId(catalogId, pagination) {
  pagination = {
    limit: 2,
    page: 0,
    ...pagination,
  };
  const text = `select p.*, c."name" as catalog_name from catalogs c inner join products p  on c.id = p.catalog_id where p.catalog_id = $1 order by p.id limit $2 offset $3`;
  var res = await db.client.query(text, [catalogId, pagination.limit, pagination.page * pagination.limit]);
  return res.rows;
}

module.exports = {
  createOrReplaceProduct,
  deleteProductById,
  getAllProducts,
  getProductByCatalogId,
};
