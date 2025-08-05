const { Client } = require('pg');

// SQL para criar tabela se não existir
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    companion VARCHAR(10) DEFAULT 'não',
    event VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// SQL para alterar campos existentes se necessário
const ALTER_TABLE_SQL = `
  DO $$ 
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'name' AND character_maximum_length != 100) THEN
      ALTER TABLE guests ALTER COLUMN name TYPE VARCHAR(100);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'phone' AND character_maximum_length != 15) THEN
      ALTER TABLE guests ALTER COLUMN phone TYPE VARCHAR(15);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'cpf' AND character_maximum_length != 14) THEN
      ALTER TABLE guests ALTER COLUMN cpf TYPE VARCHAR(14);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'companion' AND character_maximum_length != 10) THEN
      ALTER TABLE guests ALTER COLUMN companion TYPE VARCHAR(10);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'event' AND character_maximum_length != 20) THEN
      ALTER TABLE guests ALTER COLUMN event TYPE VARCHAR(20);
    END IF;
  END $$;
`;

// Função para obter cliente do banco
async function getDBClient() {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    await client.query(CREATE_TABLE_SQL);
    await client.query(ALTER_TABLE_SQL);
    console.log('Conectado ao banco Neon e tabela atualizada');
    return client;
  } catch (error) {
    console.error('Erro ao conectar:', error);
    throw error;
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

  let client;
  try {
    client = await getDBClient();
    
    switch (event.httpMethod) {
      case 'GET':
        return await getGuests(headers, client);
      
      case 'POST':
        return await createGuest(event, headers, client);
        
      case 'DELETE':
        if (event.path.includes('/clear')) {
          return await clearAllGuests(headers, client);
        }
        return await deleteGuest(event, headers, client);
        
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
      body: JSON.stringify({ error: 'Erro interno do servidor', details: error.message })
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};

// Buscar todos os convidados
async function getGuests(headers, client) {
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
async function createGuest(event, headers, client) {
  try {
    const { name, phone, cpf, companion, event: eventType } = JSON.parse(event.body);
    
    console.log('Dados recebidos:', { name, phone, cpf, companion, eventType });
    
    const result = await client.query(
      'INSERT INTO guests (name, phone, cpf, companion, event) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, phone, cpf, companion || 'não', eventType]
    );
    
    console.log('Convidado salvo:', result.rows[0]);
    
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
      body: JSON.stringify({ error: 'Erro ao salvar dados', details: error.message })
    };
  }
}

// Deletar convidado
async function deleteGuest(event, headers, client) {
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
async function clearAllGuests(headers, client) {
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