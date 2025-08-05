const { Client } = require('pg');

// Configuração do Neon Database
const client = new Client({
  connectionString: process.env.DATABASE_URL,  // Variável do Netlify/Neon
  ssl: {
    rejectUnauthorized: false
  }
});

// SQL para criar tabela se não existir
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    companion VARCHAR(10) DEFAULT 'não',
    event VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Conectar ao banco
async function connectDB() {
  try {
    await client.connect();
    await client.query(CREATE_TABLE_SQL);
    console.log('Conectado ao banco Neon');
  } catch (error) {
    console.error('Erro ao conectar:', error);
  }
}

// Handler principal
exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  await connectDB();

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getGuests(headers);
      
      case 'POST':
        return await createGuest(event, headers);
        
      case 'DELETE':
        if (event.path.includes('/clear')) {
          return await clearAllGuests(headers);
        }
        return await deleteGuest(event, headers);
        
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Método não permitido' })
        };
    }
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
};

// Buscar todos os convidados
async function getGuests(headers) {
  try {
    const result = await client.query('SELECT * FROM guests ORDER BY created_at DESC');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        guests: result.rows,
        count: result.rows.length
      })
    };
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar dados' })
    };
  }
}

// Criar novo convidado
async function createGuest(event, headers) {
  try {
    const { name, phone, cpf, companion, event: eventType } = JSON.parse(event.body);
    
    const result = await client.query(
      'INSERT INTO guests (name, phone, cpf, companion, event) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, phone, cpf, companion || 'não', eventType]
    );
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        guest: result.rows[0]
      })
    };
  } catch (error) {
    console.error('Erro ao criar convidado:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Erro ao salvar dados' })
    };
  }
}

// Deletar convidado
async function deleteGuest(event, headers) {
  try {
    const guestId = event.path.split('/').pop();
    
    await client.query('DELETE FROM guests WHERE id = $1', [guestId]);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Erro ao deletar convidado:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Erro ao deletar' })
    };
  }
}

// Limpar todos os convidados
async function clearAllGuests(headers) {
  try {
    await client.query('DELETE FROM guests');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Todos os dados foram removidos' })
    };
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao limpar dados' })
    };
  }
}