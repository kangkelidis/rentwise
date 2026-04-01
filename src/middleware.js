import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
      // allow DB diagnostics endpoint without auth
      publicRoutes: ['/api/health/db', '/api/health/db(.*)'],
      ignoredRoutes: ['/api/health/db', '/api/health/db(.*)']
})

export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
