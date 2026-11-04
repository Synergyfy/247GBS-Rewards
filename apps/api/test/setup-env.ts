// Runs before any test module is imported.
process.env.NODE_ENV = 'test';
process.env.PROFILE = 'test';
process.env.POSTGRES_NAME =
  process.env.E2E_POSTGRES_NAME ?? '247gbs_rewards_test';
process.env.DB_SSL = 'false';
