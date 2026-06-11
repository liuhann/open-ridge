const HttpError = require('./http_error')
const { PAYMENT_REQUIRED } = require('./err_codes')

module.exports = class PaymentRequiredError extends HttpError {
  constructor (msg, props) {
    super(PAYMENT_REQUIRED, msg, props)
  }
}
