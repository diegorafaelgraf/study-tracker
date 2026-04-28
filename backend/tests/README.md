# Backend E2E Tests

This folder contains end-to-end tests for the backend API.

## Run E2E tests

From the `backend` folder:

```bash
npm run test:e2e -- --runInBand
```

## Files

- `jest-e2e.json` — Jest configuration for e2e tests.
- `setup.ts` — Shared test setup and login helper.
- `*.e2e.spec.ts` — Individual end-to-end test suites.

## Notes

- Tests run against the database configured by `MONGO_URI` in `backend/.env`.
- The setup drops the database before each suite and creates an admin user.
- Each test file covers one endpoint or endpoint group.
