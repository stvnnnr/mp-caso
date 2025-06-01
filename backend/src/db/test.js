/**
 * test.js
 * - Prueba la conexión a la base de datos.
 * - Ejecuta consultas simples para verificar que todo funciona.
 * - Cierra la conexión al final.
 */

const { getPool, closePool, sql } = require('./connection');

async function testConnection() {
  let pool;
  try {
    console.log('\n=== INICIANDO PRUEBA DE CONEXIÓN ===');

    // 1. Intentar obtener el pool (conectar a SQL Server)
    pool = await getPool();

    // 2. Ejecutar una consulta simple: versión de SQL Server
    const versionResult = await pool.request().query('SELECT @@VERSION AS version');
    console.log('\nVersión de SQL Server:\n', versionResult.recordset[0].version);

    // 3. Comprobar que la tabla "Fiscalías" existe y mostrar cuántas filas tiene
    const fiscaliasResult = await pool.request().query('SELECT * FROM Fiscalías');
    console.log(`\nFiscalías encontradas: ${fiscaliasResult.recordset.length}`);

    // 4. Mostrar los primeros 5 registros (o todos si hay pocos)
    if (fiscaliasResult.recordset.length > 0) {
      console.log('\nDatos de las primeras Fiscalías:');
      fiscaliasResult.recordset.slice(0, 5).forEach(f => {
        console.log(`  • ${f.FiscalíaID}: ${f.NombreFiscalía}`);
      });
    }

    // 5. Hacer una segunda prueba: tabla "Casos"
    const casosResult = await pool.request().query('SELECT TOP 5 * FROM Casos');
    console.log(`\nCasos (TOP 5): ${casosResult.recordset.length} filas`);
    casosResult.recordset.forEach(c => {
      console.log(`  • CasoID=${c.CasoID} | Estado=${c.Estado} | FiscalAsignado=${c.FiscalAsignado}`);
    });

    console.log('\nPRUEBA EXITOSA');

  } catch (error) {
    console.error('\nERROR EN PRUEBA');
    console.error('Mensaje:', error.message);

    // Si es un error de SQL, mostrar más detalles
    if (error.code) console.error('Código SQL:', error.code);
    if (error.number) console.error('Número error:', error.number);

    // Mostrar valores de config que se usaron
    console.log('\nConfiguración usada:');
    console.log({
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      port: process.env.DB_PORT
    });

  } finally {
    // 6. Cerrar el pool (importante para que node no consuma recursos)
    await closePool();
    console.log('\nConexión (pool) cerrada');
  }
}

// Ejecutar la prueba
testConnection();
