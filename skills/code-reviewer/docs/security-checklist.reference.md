# Security Review Checklist

## Authentication & Authorization
- [ ] All endpoints require authentication unless explicitly public
- [ ] Role-based access control is enforced at the API layer
- [ ] JWT tokens have reasonable expiration times
- [ ] Refresh tokens are rotated on use

## Input Validation
- [ ] All user input is validated on the server side
- [ ] SQL queries use parameterized statements
- [ ] File uploads validate MIME type and size
- [ ] URLs are validated before server-side requests (SSRF prevention)

## Data Exposure
- [ ] Sensitive fields are excluded from API responses
- [ ] Error messages don't leak internal details
- [ ] Logs don't contain PII or credentials
- [ ] Debug endpoints are disabled in production
