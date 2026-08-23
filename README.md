# Phishy
Something really phishy!?!

## Tech Stack

- HTML
- CSS
- Bootstrap
- JavaScript
- Node.js
- Express.js
- In-memory data storage

## Local Deployment

### 1. Clone the repository

```bash
git clone https://github.com/Facelessism/Phishy.git
cd Phishy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
ADMIN_TOKEN=your-admin-token
```

Use a strong random value for the admin token.

Do not commit `.env` to the repository.

### 4. Start the server

```bash
node server/server.js
```

The server will run on:

```text
http://localhost:3000
```

### 5. Open Phishy

Admin panel:

```text
http://localhost:3000/admin
```

Receiver page:

```text
http://localhost:3000/
```

## Important Notes

Phishy currently uses in-memory storage. Link data, visitor records, and submitted responses are lost whenever the server restarts.

The current version is intended for local development and experimentation. A persistent database and production-grade authentication should be added before deploying Phishy for real-world use.

Only use visitor information and destination links in accordance with applicable laws and the consent/privacy requirements of your deployment.

## Contribution

Contributions are welcome.

### Getting Started

1. Fork the repository.
2. Clone your fork.
3. Create a new branch:

```bash
git checkout -b feature/your-feature
```

4. Make your changes.
5. Test the project locally.
6. Commit your changes:

```bash
git add .
git commit -m "Add your change"
```

7. Push your branch:

```bash
git push origin feature/your-feature
```

8. Open a pull request.

### Contribution Guidelines

* Keep changes focused and relevant.
* Follow the existing project structure.
* Clearly describe what your pull request changes and why.

## License

See the `LICENSE` file for licensing information.

