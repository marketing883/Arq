/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimize bundling - exclude heavy client-only packages from server bundle
  serverExternalPackages: ["dompurify"],

  images: {
    domains: ["thearq.ai"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // XSS Protection (legacy browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer Policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions Policy (formerly Feature-Policy)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Content Security Policy - TEMPORARILY DISABLED for GTM debugging
          // {
          //   key: "Content-Security-Policy",
          //   value: [
          //     "default-src 'self'",
          //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cal.com https://*.cal.com https://vercel.live https://*.vercel.com https://www.googletagmanager.com https://*.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://tagmanager.google.com https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com https://*.google.com https://ssl.google-analytics.com",
          //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          //     "font-src 'self' https://fonts.gstatic.com",
          //     "img-src 'self' data: blob: https: http:",
          //     "media-src 'self' https: blob:",
          //     "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.openai.com https://ipapi.co https://cal.com https://*.cal.com wss://*.supabase.co https://api.resend.com https://*.mailchimp.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https://googletagmanager.com https://*.google.com https://*.doubleclick.net https://ssl.google-analytics.com https://region1.google-analytics.com https://region1.analytics.google.com",
          //     "frame-src 'self' https://cal.com https://*.cal.com https://vercel.live https://www.googletagmanager.com https://*.doubleclick.net",
          //     "object-src 'none'",
          //     "base-uri 'self'",
          //     "form-action 'self'",
          //     "frame-ancestors 'none'",
          //     "upgrade-insecure-requests",
          //   ].join("; "),
          // },
          // HSTS - Force HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Less restrictive CSP for admin routes (needed for some functionality)
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },

  // Redirects for deprecated pages
  async redirects() {
    return [
      {
        source: "/solutions/arqrelease",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/solutions/arqoptimize",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/solutions/arqfwa",
        destination: "/products/arqfwa",
        permanent: true,
      },
      {
        source: "/solutions/arqintel",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/platform",
        destination: "/how-it-works",
        permanent: true,
      },
      {
        source: "/agents",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/agents/blueprints",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
