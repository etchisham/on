export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: false,
    promoteSpinPur: false,
  },
  telemetry: false,
  forgotPassword: {
    from: 'noreply@example.com',
    replyTo: 'noreply@example.com',
  },
});
