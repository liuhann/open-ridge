const path = require('path')

module.exports = {
  apps: [{
    name: 'ridge_cloud',
    script: path.resolve(__dirname, './boot.js'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }]
}
