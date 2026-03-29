/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers following OWASP and industry best practices
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy - prevent XSS attacks and data injection
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://api.linkedin.com http://127.0.0.1:* http://localhost:* https://*; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
          },
          // Prevent browsers from MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          // Prevent clickjacking attacks
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          // Enable XSS protection in older browsers
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          // Control referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          // Control browser features (e.g., microphone, camera, geolocation)
          {
            key: "Permissions-Policy",
            value: "microphone=(), camera=(), geolocation=(), payment=()"
          },
          // Enforce HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          // Prevent browsers from assuming text/html for unknown types
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none"
          },
          // Disable FLoC (Federated Learning of Cohorts)
          {
            key: "Permissions-Policy",
            value: "interest-cohort=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
