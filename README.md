# Intelligent Registration System

## Overview
This project contains a modern, responsive Registration System with performing automation tests using Playwright.

## Project Structure
- `index.html`: Main registration form.
- `style.css`: Modern Light theme styling.
- `script.js`: Form logic, validations, and mockup simulation.
- `tests/`: Contains the Playwright automation script (`automation.spec.js`).
- `screenshots/`: Generated screenshots from the automation runs.

## How to Run

### 1. Web Page
You can open `index.html` directly in your browser, or serve it using the included http-server:
```bash
npm start
```
Access at: http://127.0.0.1:8080

### 2. Automation Tests
To run the automated test suite (Negative, Positive, and Logic flows):
```bash
npm test
```
This will run Playwright in headless mode. To see the browser action:
```bash
npm run test:headed
```

## Features
- **Modern UI**: Clean design with vibrant accents.
- **Validations**: Real-time checking for required fields, email format, and password strength.
- **Automation**: Covers error states, successful submission, and dynamic form logic.
