'use strict';

const loopback = require('loopback');
const app = loopback();
const ds = app.dataSource.name;
console.log(app.dataSource);

const lbTables = ['Customer', 'Item', 'Order', 'Product'];
ds.automigrate(lbTables, (er) => {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ',
    ds.adapter.name);
  ds.disconnect();
});
