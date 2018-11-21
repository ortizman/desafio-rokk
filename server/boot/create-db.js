module.exports = (app) => {
  app.dataSources.shop.automigrate();
  console.log('Performed automigration.');
}