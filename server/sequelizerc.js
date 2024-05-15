import path from 'path';

module.exports = {
  'config': path.resolve('src', 'config', 'config.cjs'),
  'models-path': path.resolve('src', 'models'),
  'migrations-path': path.resolve('src', 'migrations'),
  'seeders-path': path.resolve('src', 'seeders')
};
