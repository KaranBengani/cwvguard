
# 🔒 cwvguard

A powerful build-time utility designed to analyze your **Next.js** routes using **Core Web Vitals** and automatically block underperforming pages with **Edge Middleware**. Improve perceived performance and maintain top-tier UX by preventing users from accessing low-quality routes.

---

## ✨ Features

- 🔍 **Prebuild CLI (`cwvguard-prebuild`)**: Analyze all static and dynamic routes in your Next.js app for Core Web Vitals performance.
- 🚫 **Auto-generated middleware**: Automatically create Edge Middleware to block low CWV routes from being accessed by end users.
- ⚙️ **Standalone Utilities**: Also exports reusable functions to:
  - Read static route structures from a Next.js build.
  - Calculate CWV scores using the PageSpeed Insights API.
  - Use these utilities independently in custom workflows or dashboards.
- 🔗 Works seamlessly with Next.js Edge Middleware architecture.
- 💡 Fully configurable & easy to integrate into CI/CD pipelines.

---

## 📦 Installation

```bash
npm install cwvguard
```

---

## 🚀 Setup & Configuration

After installing the package, you need to provide **four inputs** when running the CLI:

1. **Project Root Path** – path to your local Next.js app (e.g., `./`).
2. **Domain URL** – the **live** URL where your site is deployed.
3. **PageSpeed Insights API Key** – required for PSI data.
   - You can [generate your PSI API key here](https://developers.google.com/speed/docs/insights/v5/get-started).
4. **Threshold Score** – Lighthouse Score threshold (0–100). Routes scoring below this will be blocked if consuming the middleware.

---

## 🛠️ Usage

### 🔹 CLI (One-off Execution)

```bash
npx cwvguard-prebuild <project-root> <domain-url> <pagespeed-api-key> <threshold>
```

#### Example:

```bash
npx cwvguard-prebuild ./ https://example.com YOUR_API_KEY 70
```

This will:
- Crawl and collect static routes
- Evaluate CWV scores from PSI
- Generate:
  - A `middleware.ts` file with route-blocking logic
  - A `blocked-routes.json` file listing poor-performing routes

---

### 🔹 Recommended Setup: Add to `package.json` Scripts

To automate this before every production build:

```json
{
  "scripts": {
    "prebuild": "cwvguard-prebuild ./ https://your-live-site.com <your-psi-key> 70",
    "build": "next build"
  }
}
```

Then simply run:

```bash
npm run build
```

---

## 📁 Outputs

After running the CLI, you’ll get:

- ✅ `blocked-routes.json` — list of routes with CWV scores below your threshold.
- ✅ `middleware.ts` — auto-generated Next.js middleware that prevents those routes from rendering (requires manual setup).
- ✅ Console logs — details on analyzed routes and their performance scores.

---

## 🧱 Using the Middleware

To enable the middleware in your Next.js project:
1. Create a file named `middleware.ts` in the root directory of your application.
2. Paste the following boilerplate 

```ts
//middleware.ts
import { createMiddleware, config } from 'cwvguard';
 
import blockedRoutes from './public/blocked-routes.json' //edit this path if required
console.info(`[cwv-blocked-routes] are as follows ${blockedRoutes}`)
export const middleware = createMiddleware(blockedRoutes);
export { config };
```
No changes are needed to next.config.js unless you're customizing matcher behavior.

The cwvguard-prebuild CLI generates a file :
- `/public/blocked-routes.json`: The list of routes to block.
- `middleware.ts` reads the json file. You might encounter an error or warning the first time you set this up. Don’t worry—this happens because `blocked-routes.json` doesn’t exist yet. It only gets generated when the prebuild script runs. Once the prebuild process completes and the next build is triggered, the temporary error will disappear.

---

## 📚 Importable Utilities

You can use `cwvguard` programmatically within your Node.js scripts or tooling:

```ts
import { generateRoutes, checkPerformance } from 'cwvguard';

// Example: Get all static routes in your project
const routes = await generateRoutes('./');

// Example: Calculate CWV score of a route 
// parameters:  baseUrl: string ,routes:string[] , apiKey: string, threshold : number 
const result = await checkPerformance('https://www.example.com',['/about'], 'YOUR_API_KEY',50);

console.log(result);
/*
   {
     "url": "/",
     "LHS_Score": 70,
     "LCP": 6.106800137499999,
     "FCP": 1.9676656225000002,
     "INP": 6129.401651749999,
     "CLS": 0.02978873885368724,
     "FID": 89,
     "blocked": false
   },
*/
```

Perfect for custom dashboards, analytics pipelines, or internal devtools.

You can checkout [CWVDashboard][https://www.npmjs.com/package/cwvdashboard] - a simple plug and play dashboard developed complementary to CWVGuard to visualize your results.

---

## 📎 Related

- 🔗 [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
- 🔗 [Next.js Middleware Docs](https://nextjs.org/docs/advanced-features/middleware)
- 🔗 [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)

---

## 📃 License

ISC © [Karan Bengani](https://github.com/KaranBengani)

---