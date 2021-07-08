var db = require("../database/db");
var moment = require('moment');
var uuid = require('uuid');

// pg library caches query to runs faster for the second time
async function createOrReplaceCatalog(catalog) {
  const text = `INSERT INTO catalogs(id, name, description, created_at) VALUES($1, $2, $3, $4)
    on conflict(id) do update set name = $2, description = $3, created_at = $4
    RETURNING *`;
  const values = [catalog.id || uuid.v4(), catalog.name, catalog.description, moment().toISOString()];
  await db.client.query(text, values);
}

async function deleteCatalogById(catalogId) {
  const text = `delete from catalogs where id=$1`;
  await db.client.query(text, [catalogId]);
}

async function getAllCatalogs(pagination) {
  // default page rules
  pagination = {
    limit: 20,
    page: 0,
    ...pagination,
  };
  const text = `select * from catalogs order by id limit $1 offset $2`;
  var res = await db.client.query(text, [pagination.limit, pagination.page * pagination.limit]);
  return res.rows;
}

async function getCatalogById(catalogId) {
  const text = `select * from catalogs where id=$1`;
  var res = await db.client.query(text, [catalogId]);
  console.log("fetched successfully from catalogs table", res);
}

module.exports = {
  createOrReplaceCatalog,
  deleteCatalogById,
  getAllCatalogs,
  getCatalogById,
};
