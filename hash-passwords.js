const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function hashPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fit_turnos',
  });

  try {
    // Obtener todos los usuarios
    const [usuarios] = await connection.query('SELECT usuario_id, password FROM usuarios');

    console.log(`Encontrados ${usuarios.length} usuarios`);

    for (const usuario of usuarios) {
      // Verificar si ya está hasheado (bcrypt comienza con $2a$, $2b$ o $2y$)
      if (usuario.password.startsWith('$2a$') || usuario.password.startsWith('$2b$') || usuario.password.startsWith('$2y$')) {
        console.log(`✅ Usuario ${usuario.usuario_id} ya tiene contraseña hasheada`);
        continue;
      }

      // Hashear la contraseña
      const hashed = await bcrypt.hash(usuario.password, 10);
      await connection.query('UPDATE usuarios SET password = ? WHERE usuario_id = ?', [hashed, usuario.usuario_id]);
      console.log(`✓ Usuario ${usuario.usuario_id}: contraseña hasheada`);
    }

    console.log('\n✅ Todas las contraseñas han sido hasheadas correctamente');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

hashPasswords();
