# Contributing to Alternate Authentication

First off, thank you for considering contributing to Alternate Authentication! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue using our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful

### Pull Requests

1. **Fork** the repo and create your branch from `main`
2. **Install** dependencies: `npm install`
3. **Make** your changes
4. **Test** your changes thoroughly
5. **Commit** with a clear message describing your changes
6. **Push** to your fork and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Alternate-Authentication.git
cd Alternate-Authentication

# Install dependencies
npm install

# For desktop app development
cd Application/Desktop
npm install

# Start the backend server
cd backend
node server.js
```

## Style Guidelines

### JavaScript

- Use ES6+ features where appropriate
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commits

- Use clear, descriptive commit messages
- Reference issues in commits when applicable (e.g., "Fix #123")
- Keep commits atomic - one logical change per commit

### Documentation

- Update README.md if you change functionality
- Add JSDoc comments to new functions
- Keep documentation up to date with code changes

## Project Structure

```
├── Application/
│   ├── Desktop/      # Electron app
│   └── Extension/    # Chrome extension
├── Enterprise/       # BigchainDB integration
├── Home/            # Home user storage backends
└── package.json
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing!
