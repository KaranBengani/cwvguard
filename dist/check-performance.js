import fetch from "node-fetch";
import fs from "fs";
import path from "path";
const outputJsonPath = path.join(process.cwd(), "public/cwv-scores-manual.json");
export const checkPerformance = async (baseUrl, routes, apiKey, threshold = 50) => {
    const blocked = [];
    const results = [];
    for (const route of routes) {
        const url = `${baseUrl}${route}`;
        const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`);
        const json = await response.json();
        const score = json.lighthouseResult?.categories?.performance?.score * 100;
        const metrics = json.lighthouseResult?.audits;
        const extractMetric = (key) => parseFloat(metrics[key]?.numericValue || 0);
        const res = {
            url: route == '/' ? baseUrl : route,
            LHS_Score: score,
            LCP: extractMetric("largest-contentful-paint") / 1000,
            FCP: extractMetric("first-contentful-paint") / 1000,
            INP: extractMetric("interactive"),
            CLS: extractMetric("cumulative-layout-shift"),
            FID: extractMetric("max-potential-fid"),
        };
        if (score < threshold) {
            blocked.push(route);
            console.log(`❌ ${url} - ${score}`);
            res["blocked"] = true;
        }
        else {
            console.log(`✅ ${url} - ${score}`);
            res["blocked"] = false;
        }
        results.push(res);
    }
    console.log("CWV check completed written");
    return results;
};
export const checkPerformancePrebuild = async (baseUrl, apiKey, threshold = 50, routes) => {
    const blocked = [];
    const results = [];
    for (const route of routes) {
        const url = `${baseUrl}${route}`;
        const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`);
        const json = await response.json();
        const score = json.lighthouseResult?.categories?.performance?.score * 100;
        const metrics = json.lighthouseResult?.audits;
        const extractMetric = (key) => parseFloat(metrics[key]?.numericValue || 0);
        const res = {
            url: route == '/' ? baseUrl : route,
            LHS_Score: score,
            LCP: extractMetric("largest-contentful-paint") / 1000,
            FCP: extractMetric("first-contentful-paint") / 1000,
            INP: extractMetric("interactive"),
            CLS: extractMetric("cumulative-layout-shift"),
            FID: extractMetric("max-potential-fid"),
        };
        if (score < threshold) {
            blocked.push(route);
            console.log(`❌ ${url} - ${score}`);
            res["blocked"] = true;
        }
        else {
            console.log(`✅ ${url} - ${score}`);
            res["blocked"] = false;
        }
        results.push(res);
    }
    const publicPath = path.join(process.cwd(), "public/blocked-routes.json");
    fs.writeFileSync(outputJsonPath, JSON.stringify(results.sort(), null, 2));
    fs.writeFileSync(publicPath, JSON.stringify(blocked, null, 2));
    console.log("🚫 blocked-routes.json written");
};
