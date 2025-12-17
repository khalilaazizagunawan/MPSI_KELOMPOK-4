const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('  Verifying HTTPS Configuration');
console.log('=========================================');
console.log('');

const certPath = path.join(__dirname, 'ssl', 'cert.pem');
const keyPath = path.join(__dirname, 'ssl', 'key.pem');

const certExists = fs.existsSync(certPath);
const keyExists = fs.existsSync(keyPath);

console.log('Certificate Check:');
console.log(`  cert.pem: ${certExists ? '✓ Found' : '✗ Not found'} (${certPath})`);
console.log(`  key.pem: ${keyExists ? '✓ Found' : '✗ Not found'} (${keyPath})`);
console.log('');

if (certExists && keyExists) {
    try {
        const cert = fs.readFileSync(certPath);
        const key = fs.readFileSync(keyPath);
        
        console.log('Certificate Details:');
        console.log(`  Cert size: ${cert.length} bytes`);
        console.log(`  Key size: ${key.length} bytes`);
        console.log('');
        
        // Test HTTPS connection
        console.log('Testing HTTPS connection...');
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/health',
            method: 'GET',
            rejectUnauthorized: false // Allow self-signed
        };
        
        const req = https.request(options, (res) => {
            console.log(`  Status: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log('  ✓ HTTPS is working!');
            } else {
                console.log('  ⚠️  HTTPS responded but with non-200 status');
            }
        });
        
        req.on('error', (e) => {
            console.log(`  ✗ HTTPS connection failed: ${e.message}`);
            console.log('  Server might not be running or not using HTTPS');
        });
        
        req.setTimeout(3000, () => {
            req.destroy();
            console.log('  ✗ Connection timeout');
        });
        
        req.end();
        
    } catch (error) {
        console.error('Error reading certificate:', error.message);
    }
} else {
    console.log('⚠️  Certificate files not found!');
    console.log('   Run: node generate-ssl.js');
}

console.log('');
console.log('=========================================');

