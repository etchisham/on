const fs = require('fs');
const path = require('path');

function validateSecrets() {
  const required = [
    'APP_KEYS',
    'API_TOKEN_SALT',
    'ADMIN_JWT_SECRET',
    'TRANSFER_TOKEN_SALT',
    'JWT_SECRET',
    'POSTGRES_PASSWORD',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.error(`Missing required secrets: ${missing.join(', ')}`);
    console.error('Generate secure values with:');
    console.error('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    const appKeys = process.env.APP_KEYS?.split(',') || [];
    if (appKeys.length < 2) {
      console.error('APP_KEYS must contain at least 2 comma-separated keys');
      process.exit(1);
    }

    const weakSecrets = ['change-me', 'secret', 'password', '123', 'admin'];
    for (const key of required) {
      const value = process.env[key];
      if (value && weakSecrets.some(weak => value.toLowerCase().includes(weak))) {
        console.error(`Secret ${key} appears to use a weak value`);
        process.exit(1);
      }
    }
  }

  console.log('Security validation passed');
}

module.exports = validateSecrets;
