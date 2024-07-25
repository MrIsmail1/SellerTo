# SellerTo

Welcome to SellerTo, your complete e-commerce platform solution. This README will guide you through launching the project using Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to launch the SellerTo project:

### 1. Clone the Repository

```bash
    git clone https://github.com/MrIsmail1/SellerTo.git
```

```bash
    cd SellerTo
```

### 2. Create Environment Variables

Create three `.env` files with the necessary environment variables.

#### Server Directory

Create a `.env` file in the `server` directory with the following content:

`DATABASE_URL=""`

`MONGO_CONNECTION=""`

`JWT_SECRET=""`

`EMAIL_USERNAME=""`

`EMAIL_PASSWORD=""`

`APP_BASE_URL_CLIENT=http://localhost:5173`

`APP_BASE_URL_SERVER=http://localhost:3000`

`STRIPE_SECRET_KEY=""`

`STRIPE_WEBHOOK_SECRET=""`

`POSTGRES_DB=""`

`POSTGRES_USER=""`

`POSTGRES_PASSWORD=""`

`POSTGRES_HOST=""`

`POSTGRES_HOST_PORT=""`

#### Root Directory

Create a `.env` file in the root directory with the following content:

`MONGO_INITDB_ROOT_USERNAME=""`

`MONGO_INITDB_ROOT_PASSWORD=""`

`POSTGRES_DB=""`

`POSTGRES_USER=""`

`POSTGRES_PASSWORD=""`

`NODE_ENV=""`

#### Client Directory

Create a `.env` file in the `client` directory with the following content:

`VITE_APP_BASE_URL_SERVER='http://localhost:3000/api'`

`VITE_STRIPE_PUBLISHABLE_KEY=""`

### 3. Build and Run the Containers

Use Docker Compose to build and run the containers.

```bash
    docker compose up -d --build
```

This command will:

- Build the Docker images for the project.
- Start the containers as defined in the `docker-compose.yml` file.

### 4. Access the Application

Once the containers are up and running, you can access the application at `http://localhost:5173`.

## Services

The following services will be running:

- **Frontend**: Vue.js application (http://localhost:5173)
- **Backend**: Node.js server (http://localhost:3000)
- **Database**: MongoDB (http://localhost:27017)
- **Database**: PostgreSQL with Sequelize

## Database Setup

To create and migrate the PostgreSQL database using Sequelize, run the following commands:

```bash
    docker compose exec server npm run db:create
```

```bash
    docker compose exec server npm run db:migrate
```

To drop the PostgreSQL database, run:

```bash
    docker compose exec server npm run db:drop
```

## Stopping the Application

To stop the application, run:

```bash
    docker compose down
```

This command will stop the containers, networks, and volumes defined in `docker-compose.yml`.

## Contributing

If you would like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## Task List

| Task                                                      | Collaborators                  |
| --------------------------------------------------------- | ------------------------------ |
| E-commerce website : Authentification & Register          | Zhamza1                        |
| E-commerce website : HomePage                             | Zhamza1                        |
| E-commerce website : Cart Management & Stripe integration | Zhamza1                        |
| E-commerce website : GDPR (RGPD in french)                | Zhamza1 & SebRamZz             |
| E-commerce website : Orders and Profile                   | SebRamZz                       |
| E-commerce website : Alerts and newsletter                | SebRamZz                       |
| Admin backoffice : Dashboard and widgets                  | MrIsmail1 & SebRamZz           |
| Admin backoffice : Products and images                    | MrIsmail1                      |
| Admin backoffice : Orders                                 | MrIsmail1                      |
| Admin backOffice : Stock Management                       | MrIsmail1 & SebRamZz           |
| Admin backOffice : Promo codes Management                 | MrIsmail1 & SebRamZz           |
| Admin backOffice : Users & roles management               | MrIsmail1                      |
| Admin backOffice : NewsLetter                             | SebRamZz                       |
| Units and integration tests                               | Zhamza1 & MrIsmail1 & SebRamZz |
| CI/CD                                                     | Zhamza1                        |
| Production                                                | MrIsmail1                      |

## Acknowledgments

We would like to extend our heartfelt gratitude to all the contributors for their tireless hard work and dedication. Your efforts have been instrumental in our success. Additionally, we are deeply appreciative of the unwavering support and guidance from our development coaches at ESGI. Your mentorship and expertise have been invaluable in helping us achieve our goals. Thank you for your continued commitment and encouragement.
