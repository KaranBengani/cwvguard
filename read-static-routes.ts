import fs from 'fs';
import path from 'path';

const outputJsonPath = path.join(process.cwd(), "public/static-routes.json");
function isDynamicRoute(route: string): boolean {
  return route.includes('[') || route.includes(']');
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\/?\([^/]+\)\//, ''); // For Windows compatibility
}
export function generateRoutes(rootPath: string): string[] {
  var appDir = path.join(rootPath, 'app');
  var pagesDir = path.join(rootPath, 'pages');

  let routePaths: string[] = [];

  const scanDir = (dirPath: string, baseRoute = '') => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = normalizePath(path.relative(appDir, fullPath));

      if (entry.isDirectory()) {
        if (entry.name === 'api') continue; // skip /api
        scanDir(fullPath, path.join(baseRoute, entry.name));
      } else if (
        entry.name === 'page.tsx' || 
        entry.name === 'page.jsx' || 
        entry.name === 'page.ts' ||
        entry.name === 'page.js'
      ) {
        const route = '/' + normalizePath(baseRoute);
        if (!isDynamicRoute(route)) {
          routePaths.push(route === '/index' ? '/' : route);
        }
      }
    }
  };
  if(!fs.existsSync(appDir) && !fs.existsSync(pagesDir)){
    appDir = path.join(rootPath, 'src/app');
    pagesDir = path.join(rootPath, 'src/pages')
  }
  if (fs.existsSync(appDir)) {
    // New app/ directory-based routing
    scanDir(appDir);
  } else if (fs.existsSync(pagesDir)) {
    // Old pages/ directory-based routing
    const walkPages = (dirPath: string, routePrefix = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === 'api') continue;
          walkPages(fullPath, path.join(routePrefix, entry.name));
        } else if (
          entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.ts')
        ) {
          const nameWithoutExt = entry.name.split('.')[0];
          if (['_app', '_document', '_error'].includes(nameWithoutExt)) continue;
          if (isDynamicRoute(nameWithoutExt)) continue;

          const route = '/' + normalizePath(path.join(routePrefix, nameWithoutExt));
          routePaths.push(route === '/index' ? '/' : route);
        }
      }
    };

    walkPages(pagesDir);
  }
  return routePaths.sort();
}
export function generateRoutesFromApp(rootPath: string): string[] {
  var appDir = path.join(rootPath, 'app');
  var pagesDir = path.join(rootPath, 'pages');

  let routePaths: string[] = [];

  const scanDir = (dirPath: string, baseRoute = '') => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = normalizePath(path.relative(appDir, fullPath));

      if (entry.isDirectory()) {
        if (entry.name === 'api') continue; // skip /api
        scanDir(fullPath, path.join(baseRoute, entry.name));
      } else if (
        entry.name === 'page.tsx' || 
        entry.name === 'page.jsx' || 
        entry.name === 'page.ts' ||
        entry.name === 'page.js'
      ) {
        const route = '/' + normalizePath(baseRoute);
        if (!isDynamicRoute(route)) {
          routePaths.push(route === '/index' ? '/' : route);
        }
      }
    }
  };
  if(!fs.existsSync(appDir) && !fs.existsSync(pagesDir)){
    appDir = path.join(rootPath, 'src/app');
    pagesDir = path.join(rootPath, 'src/pages')
  }
  if (fs.existsSync(appDir)) {
    // New app/ directory-based routing
    scanDir(appDir);
  } else if (fs.existsSync(pagesDir)) {
    // Old pages/ directory-based routing
    const walkPages = (dirPath: string, routePrefix = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === 'api') continue;
          walkPages(fullPath, path.join(routePrefix, entry.name));
        } else if (
          entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.ts')
        ) {
          const nameWithoutExt = entry.name.split('.')[0];
          if (['_app', '_document', '_error'].includes(nameWithoutExt)) continue;
          if (isDynamicRoute(nameWithoutExt)) continue;

          const route = '/' + normalizePath(path.join(routePrefix, nameWithoutExt));
          routePaths.push(route === '/index' ? '/' : route);
        }
      }
    };

    walkPages(pagesDir);
  }
  fs.writeFileSync(outputJsonPath, JSON.stringify(routePaths.sort(), null, 2));
  return routePaths.sort();
}
