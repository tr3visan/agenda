exports.middlewareGlobal = (req, resp, next) => {
  resp.locals.umaVariavelLocal = 'Valor da variavel local.'
  next()
}

exports.outroMiddleware = (req, resp, next) => {
  next()
}

exports.checkError = (err, req, resp, next) => {
  if(err && err.code === 'EBADCSRFTOKEN') {
    return resp.render('404')
  }
}

exports.csrfMiddleware = (req, resp, next) => {
  resp.locals.csrfToken = req.csrfToken()
  next()
}