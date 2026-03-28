# Security Policy & Implementation Guide

## Overview
This document outlines the security measures implemented in the Intern Tracker application, following OWASP and modern web security best practices.

## Security Features Implemented

### 1. Authentication & Authorization

#### OTP-Based Authentication
- **Rate Limiting**: Enforced at 5 OTP requests per 15-minute window per identifier (email/phone)
- **Session Management**: 30-day session TTL with secure token generation
- **Token Validation**: All protected endpoints require valid Bearer token or X-Admin-Token
- **Admin Protection**: Admin routes require X-Admin-Token header with environment-configured token

#### Session Security
- Sessions are stored in database with expiration timestamps
- Sessions can be revoked (logout)
- Invalid or expired sessions are rejected with 401 Unauthorized
- Demo mode uses separate demo tokens for testing

### 2. Input Validation & Sanitization

#### Validated Fields
- **Email**: RFC 5322 compliant email validation
- **Phone**: Format validation with country codes
- **URLs**: Full URL validation with protocol checking
- **Dates**: Future date validation for deadlines
- **Enums**: Strict status and type validation
- **Numeric Ranges**: Min/max validation for stipends

#### Constraints Enforced
- Database-level uniqueness constraints on emails
- Graduationear must be 1970-2100
- Stipends must be non-negative integers
- Application URLs must be valid HTTPS URLs
- Text fields have length limits

### 3. Error Handling

#### Generic Error Messages
- Errors do not leak sensitive information about system internals
- Database errors are caught and logged, but generic messages are returned to clients
- Auth failures use consistent error messages (don't reveal if user exists)
- Invalid OTP errors don't indicate whether challenge ID was valid

#### Error Codes
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server errors (without details in response)

### 4. CORS & HTTP Security

#### CORS Configuration
- Allowed origins are configurable via `INTERN_TRACKER_CORS_ALLOWED_ORIGINS`
- Only specific HTTP methods are allowed: GET, POST, PUT, PATCH, DELETE
- Credentials are included in CORS headers
- Preflight requests are cached for 1 hour

#### Security Headers (All Responses)
- **Content-Security-Policy (CSP)**: Restricts resource loading
- **X-Content-Type-Options**: nosniff - Prevents MIME type sniffing
- **X-Frame-Options**: DENY - Prevents clickjacking
- **X-XSS-Protection**: 1; mode=block - XSS protection for older browsers
- **Referrer-Policy**: strict-origin-when-cross-origin - Controls referrer data
- **Permissions-Policy**: Disables microphone, camera, geolocation, payment APIs
- **Strict-Transport-Security**: Enforces HTTPS with 1-year max-age
- **Cache-Control**: no-store - Prevents caching of sensitive responses

### 5. Database Security

#### Constraints
- Unique constraint on user emails prevents duplicate accounts
- Unique constraint on opportunities prevents duplicates
- Foreign key constraints ensure referential integrity
- Check constraints validate stipend values

#### Query Security
- SQL injection is prevented through SQLAlchemy ORM parameterized queries
- All user inputs are properly escaped

### 6. Audit Logging

#### Logged Events
- **Auth Events**: LOGIN, LOGOUT, OTP_REQUEST, OTP_VERIFY, SESSION_CREATED, SESSION_REVOKED
- **Admin Actions**: All CREATE, READ, UPDATE, DELETE operations on resources
- **Access Attempts**: Attempts to access protected endpoints (authorized/unauthorized)
- **Data Access**: User data queries with resource counts and filters
- **Security Events**: Rate limit violations, invalid tokens, access denials

#### Log Format
```
TIMESTAMP - AUDIT - LOGGER - LEVEL - EVENT_TYPE | field1=value1 | field2=value2
```

#### Log Locations
- All audit logs are sent to stderr/stdout
- Can be integrated with centralized logging systems (ELK, Splunk, etc.)

### 7. Rate Limiting

#### OTP Requests
- **Limit**: 5 requests per 15 minutes per identifier (email/phone)
- **Returns**: 429 Too Many Requests when exceeded

#### Admin Token
- No rate limiting (assumed to be machine-to-machine)
- Admin actions are logged for audit purposes

### 8. Frontend Security

#### Next.js Security Headers
- Content Security Policy enforced
- X-Frame-Options prevents embedding
- X-Content-Type-Options prevents MIME sniffing
- Strict-Transport-Security enforces HTTPS
- Referrer-Policy controls referrer information

#### Component Security
- AppSidebarShell hides protected links from unauthenticated users
- Admin page checks for token configuration before loading
- Error boundaries prevent information leakage in error states
- User data is only fetched and displayed if authenticated

### 9. Sensitive Data Handling

#### Never Logged
- Passwords (never stored in plain text, hashed with bcrypt)
- Full OTP codes (only hashes stored)
- Full authentication tokens (only masked references)
- Credit card or payment information

#### Always Masked
- Email addresses are masked in responses (e.g., "user@e...")
- Phone numbers are masked in responses (e.g., "+91 ****0000")
- User IDs are UUIDs (not sequental)

### 10. Network Security

#### HTTPS Only
- All production traffic should use HTTPS
- Strict-Transport-Security header enforces HTTPS
- Secure cookies flag is set (for cookies)
- SameSite=Strict for improved CSRF protection

#### DNS Security
- Verify DNS records are correct
- Consider using DNSSEC

## Configuration Guide

### Environment Variables for Security

```bash
# Core security settings
INTERN_TRACKER_ADMIN_TOKEN=your-secure-secret-token
INTERN_TRACKER_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Session management
INTERN_TRACKER_AUTH_SESSION_TTL_DAYS=30

# Rate limiting
INTERN_TRACKER_AUTH_OTP_REQUEST_LIMIT=5
INTERN_TRACKER_AUTH_OTP_REQUEST_WINDOW_MINUTES=15

# Cookie security
INTERN_TRACKER_SECURE_COOKIES=true  # HTTPS only
INTERN_TRACKER_SAMESITE_COOKIES=strict
```

## Deployment Checklist

### Before Going to Production

- [ ] Set strong `INTERN_TRACKER_ADMIN_TOKEN` (minimum 32 characters, random)
- [ ] Configure `INTERN_TRACKER_CORS_ALLOWED_ORIGINS` to your domain only
- [ ] Enable HTTPS/TLS on your domain
- [ ] Set secure cookies flags (Secure, HttpOnly, SameSite)
- [ ] Configure database backups and retention
- [ ] Set up audit log aggregation
- [ ] Enable database encryption at rest
- [ ] Configure WAF (Web Application Firewall) rules
- [ ] Set up monitoring and alerting for rate limit violations
- [ ] Document incident response procedures
- [ ] Enable security logging and monitoring
- [ ] Test all error handling with invalid inputs
- [ ] Verify CORS headers are correct

### Ongoing Security

- [ ] Review audit logs regularly
- [ ] Monitor for failed login attempts
- [ ] Keep dependencies updated
- [ ] Run security scanning tools
- [ ] Conduct periodic security reviews
- [ ] Test rate limiting under load
- [ ] Verify auth checks on all protected endpoints
- [ ] Review and rotate admin tokens periodically

## Incident Response

### If You Detect a Security Issue

1. **Immediately stop the service** (if critical)
2. **Log all relevant audit entries** for investigation
3. **Contact security team** at gopig@student.edu
4. **Do not disclose** the vulnerability publicly
5. **Implement a patch** as soon as possible
6. **Test thoroughly** before redeploying
7. **Document the incident** for review
8. **Notify affected users** if necessary

## Security Testing

### Manual Testing
- Test rate limiting by making multiple OTP requests
- Test auth by accessing protected endpoints without tokens
- Test CORS by making requests from different origins
- Test input validation with invalid data
- Test error handling with various error conditions

### Automated Testing
```bash
# Test for common vulnerabilities
npm audit  # Frontend dependencies
pip audit  # Backend dependencies

# Check security headers
curl -I https://yourdomain.com/api/v1/health
```

## Third-Party Dependencies

All dependencies are regularly monitored for security vulnerabilities:
- Frontend: npm audit
- Backend: pip audit

When vulnerabilities are found:
1. Check if patched version exists
2. Update to patched version
3. Run full test suite
4. Deploy to staging first
5. Monitor for issues

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/REST_API_Security_Cheat_Sheet.html)
- [Next.js Security](https://nextjs.org/docs/basic-features/security)
- [FastAPI Security](https://fastapi.tiangolo.com/advanced/security/)

## Questions or Issues

For security questions or to report vulnerabilities, contact: gopig@student.edu
