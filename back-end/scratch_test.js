import mysql from 'mysql2/promise';

async function testConnection() {
  const configs = [
    { host: 'localhost', user: 'root', password: '' },
    { host: 'localhost', user: 'root', password: '1234' },
    { host: 'localhost', user: 'root', password: 'root' },
    { host: 'localhost', user: 'api', password: '1234' },
    { host: '127.0.0.1', user: 'root', password: '' },
    { host: '127.0.0.1', user: 'root', password: '1234' },
    { host: '127.0.0.1', user: 'root', password: 'root' },
    { host: '127.0.0.1', user: 'api', password: '1234' },
    { host: '10.144.170.134', user: 'api', password: '1234' }
  ];
  for (const config of configs) {
    try {
      const conn = await mysql.createConnection(config);
      console.log('SUCCESS:', config);
      const [rows] = await conn.query('SHOW DATABASES');
      console.log('Databases:', rows.map(r => r.Database));
      await conn.end();
      return;
    } catch (e) {
      console.log('Failed:', config.user + '@' + config.host + ':', e.message);
    }
  }
}

testConnection();
