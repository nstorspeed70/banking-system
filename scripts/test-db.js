const { Client } = require('pg');

async function probarConexion() {
  console.log('🔧 Prueba de Conexión a Base de Datos');
  console.log('------------------------------------');

  const client = new Client({
    host: 'sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'sistema_bancario',
    user: 'dbmaster',
    password: 'BancoDesarrollo2025!',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('\n📡 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa!');

    console.log('\n📝 Creando tabla de prueba...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS prueba_conexion (
        id SERIAL PRIMARY KEY,
        mensaje TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('💾 Insertando datos de prueba...');
    const resultado = await client.query(`
      INSERT INTO prueba_conexion (mensaje) 
      VALUES ('Prueba de conexión desde ambiente local')
      RETURNING *;
    `);

    console.log('\n📊 Datos insertados:');
    console.log(resultado.rows[0]);

    console.log('\n🧹 Limpiando...');
    await client.query('DROP TABLE prueba_conexion;');

    console.log('\n✨ Prueba completada con éxito!');
  } catch (error) {
    console.error('\n❌ Error al conectar:', error.message);
    console.log('\nPor favor verifica:');
    console.log('1. La contraseña es correcta');
    console.log('2. El security group permite tu IP');
    console.log('3. La base de datos está activa');
  } finally {
    await client.end();
  }
}

probarConexion();
