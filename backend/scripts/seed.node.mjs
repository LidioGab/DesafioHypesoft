// Node-based seeder to avoid requiring mongosh
// Usage: node backend/scripts/seed.node.mjs

import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'hypesoft';

const categories = [
  { _id: 'cat-teclados', Name: 'Teclados', Description: 'Teclados mecânicos e de membrana' },
  { _id: 'cat-mouses', Name: 'Mouses', Description: 'Mouses gamer e escritório' },
  { _id: 'cat-headsets', Name: 'Headsets', Description: 'Headsets e fones com microfone' },
  { _id: 'cat-mousepads', Name: 'Mousepads', Description: 'Superfícies e pads para mouse' },
];

const products = [
  { _id: 'prod-teclado-mecanico', Name: 'Teclado Mecânico RGB', Description: 'Teclado mecânico com switches vermelhos e iluminação RGB', Price: 399.90, CategoryId: 'cat-teclados', StockQuantity: 25, CreatedAt: new Date() },
  { _id: 'prod-mouse-gamer', Name: 'Mouse Gamer 16000 DPI', Description: 'Mouse ergonômico com 7 botões programáveis', Price: 259.90, CategoryId: 'cat-mouses', StockQuantity: 40, CreatedAt: new Date() },
  { _id: 'prod-headset-surround', Name: 'Headset Surround 7.1', Description: 'Headset com som surround 7.1 e microfone removível', Price: 499.00, CategoryId: 'cat-headsets', StockQuantity: 12, CreatedAt: new Date() },
  { _id: 'prod-mousepad-xl', Name: 'Mousepad XL Antiderrapante', Description: 'Mousepad estendido com superfície speed e base emborrachada', Price: 129.90, CategoryId: 'cat-mousepads', StockQuantity: 8, CreatedAt: new Date() },
  { _id: 'prod-teclado-wireless', Name: 'Teclado Wireless Compacto', Description: 'Teclado sem fio compacto com bateria de longa duração', Price: 219.90, CategoryId: 'cat-teclados', StockQuantity: 60, CreatedAt: new Date() },
];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection('products').drop().catch(() => {});
  await db.collection('categories').drop().catch(() => {});

  await db.collection('categories').insertMany(categories);
  await db.collection('products').insertMany(products);

  console.log(`Seeded ${categories.length} categories and ${products.length} products into '${dbName}'.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
