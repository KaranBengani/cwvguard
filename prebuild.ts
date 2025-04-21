#!/usr/bin/env node

import path from 'path';
import { generateRoutesFromApp } from './read-static-routes.js';
import { checkPerformancePrebuild } from './check-performance.js';


const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: cwvguard-prebuild <rootPath> <baseUrl> <psiApiKey> <threshold>

Example:
  cwvguard ./ https://yourdomain.com YOUR_API_KEY 75
  `)
  process.exit(0)
}

if (args.length < 3) {
    console.error(`incorrect command !! 
      try running cwvguard-prebuild --help `);
    process.exit(1);
  }

  const [frontendRoot, baseUrl, psiApiKey, thresholdStr] = args;
  const threshold = thresholdStr ? parseInt(thresholdStr, 10) : 50;

  (async () => {
    try {
      const resolvedRoot = path.resolve(frontendRoot);
  
      console.log("📂 Scanning routes from:", resolvedRoot);
      const routes = generateRoutesFromApp(resolvedRoot);
  
      console.log("📊 Checking performance via PSI...");
      await checkPerformancePrebuild(baseUrl, psiApiKey, threshold, routes);
  
      //await backsync(routes);
      console.log("✅ Prebuild complete!");
    } catch (err) {
      console.error("🚨 Error during prebuild:", err);
      process.exit(1);
    }
  })();