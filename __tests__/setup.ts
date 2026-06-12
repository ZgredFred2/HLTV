import { defaultConfig } from '../src/config'

try {
  const { loadPage } = require('./setup.proxy')
  if (typeof loadPage === 'function') {
    defaultConfig.loadPage = loadPage
  }
} catch {}
