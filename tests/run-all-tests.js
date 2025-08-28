#!/usr/bin/env node

/**
 * Test Runner for JMON Studio
 * Runs all test suites and provides summary
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const testFiles = [
    'utils.test.js',
    'rhythm.test.js', 
    'harmony.test.js'
];

console.log('🧪 Running JMON Studio Test Suite\n');
console.log('=' .repeat(50));

let totalPassed = 0;
let totalFailed = 0;

for (const testFile of testFiles) {
    console.log(`\n📝 Running ${testFile}...`);
    console.log('-'.repeat(30));
    
    try {
        const testPath = join(__dirname, testFile);
        const output = execSync(`node ${testPath}`, { 
            encoding: 'utf8',
            cwd: process.cwd()
        });
        
        console.log(output);
        
        // Count passed/failed tests (simple heuristic)
        const passedMatches = output.match(/✅/g);
        const failedMatches = output.match(/❌/g);
        
        const passed = passedMatches ? passedMatches.length : 0;
        const failed = failedMatches ? failedMatches.length : 0;
        
        totalPassed += passed;
        totalFailed += failed;
        
        console.log(`\n${testFile}: ${passed} passed, ${failed} failed`);
        
    } catch (error) {
        console.error(`❌ Error running ${testFile}:`, error.message);
        totalFailed++;
    }
}

console.log('\n' + '='.repeat(50));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${totalPassed}`);
console.log(`❌ Failed: ${totalFailed}`);
console.log(`📈 Success Rate: ${totalPassed + totalFailed > 0 ? Math.round(totalPassed / (totalPassed + totalFailed) * 100) : 0}%`);

if (totalFailed === 0) {
    console.log('\n🎉 All tests passed! JMON Studio is ready to shine! ✨');
    process.exit(0);
} else {
    console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the output above.`);
    process.exit(1);
}