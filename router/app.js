(() => {
// Konfigurasjon:
Router.config({
  mode: 'history' /* eller 'hash' */
});

// Legge til routes:
Router
  .add(/about/, () => console.log('About'))
  .add(/products\/(.*)\/edit\/(.*)/, (params) => console.log('Products', params))
  .add(() => console.log('Default'));

Router.start();

// Forwarde til en side:
// Router.navigate('products/12/edit/22');
})();