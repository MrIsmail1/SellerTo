import path from 'path';

module.exports = {
  'config': path.resolve('server', 'config', 'config.cjs'),
  'models-path': path.resolve('server', 'models'),
  'migrations-path': path.resolve('server', 'migrations'),
  'seeders-path': path.resolve('server', 'seeders')
};
