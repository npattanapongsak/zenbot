module.exports = {
  _ns: 'zenbot',

  'strategies.pinbar': require('./strategy'),
  'strategies.list[]': '#strategies.pinbar'
}
