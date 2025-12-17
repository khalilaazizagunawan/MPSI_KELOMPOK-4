const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('  Generate Self-Signed SSL Certificate');
console.log('=========================================');
console.log('');

const sslDir = path.join(__dirname, 'ssl');

// Create ssl directory if not exists
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
    console.log('✓ Created ssl directory');
}

// Generate certificate - simplified format for selfsigned v5
const attrs = [{ name: 'commonName', value: 'localhost' }];

(async () => {
    try {
        // Generate certificate - returns Promise in v5.x
        const pems = await selfsigned.generate(attrs, {
            keySize: 4096,
            days: 365,
            algorithm: 'sha256'
        });

        // Write certificate and key
        const certPath = path.join(sslDir, 'cert.pem');
        const keyPath = path.join(sslDir, 'key.pem');

        // selfsigned v5 returns { cert, private, public }
        if (pems && pems.cert && pems.private) {
            fs.writeFileSync(certPath, pems.cert);
            fs.writeFileSync(keyPath, pems.private);
            
            console.log('✓ SSL Certificate generated successfully!');
            console.log('');
            console.log('Certificate: ssl/cert.pem');
            console.log('Private Key: ssl/key.pem');
            console.log('');
            console.log('Server will now use HTTPS.');
            console.log('Restart server with: npm run pm2:restart');
            console.log('');
            console.log('⚠️  Note: This is a self-signed certificate.');
            console.log('   Browser will show security warning (normal for development).');
            console.log('   Click "Advanced" → "Proceed to localhost" to continue.');
            console.log('');
            console.log('=========================================');
        } else {
            throw new Error('Invalid certificate format');
        }
    } catch (error) {
        console.error('Error generating certificate:', error.message);
        console.error('');
        console.error('Alternative: Install OpenSSL and run:');
        console.error('  openssl req -x509 -newkey rsa:4096 -nodes -keyout ssl/key.pem -out ssl/cert.pem -days 365 -subj "/C=ID/ST=Jakarta/L=Jakarta/O=SFJ Consulting/CN=localhost"');
        console.error('');
        process.exit(1);
    }
})();
