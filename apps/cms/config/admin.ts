export default () => ({
  auth: {
    secret: 'admin-jwt-secret-change-in-production',
  },
  apiToken: {
    salt: 'api-token-salt-change-in-production',
  },
  transfer: {
    token: {
      salt: 'transfer-token-salt-change-in-production',
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
