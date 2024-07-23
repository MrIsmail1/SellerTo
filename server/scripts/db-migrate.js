import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurer Sequelize avec l'URL de la base de données
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

// Configurer Umzug pour gérer les migrations
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../migrations/*.js'), // Chemin vers les fichiers de migration
  },
  context: sequelize.getQueryInterface(), // Contexte de migration
  storage: new SequelizeStorage({ sequelize }), // Stockage des migrations dans la base de données
  logger: console, // Journalisation
});

// Fonction pour exécuter les migrations
const runMigrations = async () => {
  try {
    await umzug.up(); // Exécuter toutes les migrations
    console.log('Migrations executed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error); // Gérer les erreurs
  } finally {
    await sequelize.close(); // Fermer la connexion à la base de données
  }
};

runMigrations(); // Appeler la fonction pour exécuter les migrations
