// Importa as dependências necessárias
const express = require('express');  // Framework para criar o servidor
const path = require('path');  // Utilitário para manipulação de caminhos de arquivos
const sqlite3 = require('sqlite3').verbose();  // Biblioteca SQLite para banco de dados

// Cria uma instância do express (aplicação)
const app = express();

// Middleware para processar JSON na requisição
app.use(express.json());

// Middleware para servir arquivos estáticos (como o frontend) da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve o arquivo 'index.html' na rota raiz (/), ou seja, quando o usuário acessa o servidor
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    
});


// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Exclui a tabela 'users' (se ela já existir), pode ser útil para garantir que a tabela será recriada
        db.run("DROP TABLE IF EXISTS users;", (err) => {
            if (err) {
                console.error("Erro ao excluir tabela:", err.message);
            } else {
                console.log("Tabela 'users' excluída com sucesso.");
            }
        });

        // Cria a tabela 'users' no banco de dados com a estrutura correta
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela users:', err.message);
                } else {
                    console.log('Tabela users criada com sucesso.');
                }
            });
    }
});

// Endpoint para criar um novo usuário (Signup)
app.post('/signup', (req, res) => {
    const { email, password } = req.body;  // Extrai email e senha do corpo da requisição

    // Verifica se email e senha foram fornecidos
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });  // Se faltarem, retorna erro 400
    }

    // Prepara a query SQL para inserir o novo usuário na tabela 'users'
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(query, [email, password], function (err) {  // Executa a query
        if (err) {
            console.error('Erro ao inserir usuário:', err.message);  // Caso ocorra erro ao inserir
            return res.status(500).json({ error: 'Erro ao criar usuário.' });  // Retorna erro 500
        }
        // Se inserido com sucesso, retorna a mensagem de sucesso junto com o ID do novo usuário
        res.status(201).json({ message: 'Usuário criado com sucesso.', id: this.lastID });
    });
});

// Endpoint para fazer login de um usuário
app.post('/login', (req, res) => {
    const { email, password } = req.body;  // Extrai email e senha do corpo da requisição

    // Verifica se email e senha foram fornecidos
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });  // Se faltarem, retorna erro 400
    }

    // Prepara a query SQL para buscar o usuário no banco de dados com o email e senha fornecidos
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {  // Executa a query
        if (err) {
            console.error('Erro ao buscar usuário:', err.message);  // Caso ocorra erro ao buscar
            return res.status(500).json({ error: 'Erro ao processar login.' });  // Retorna erro 500
        }
        if (row) {
            // Se um usuário for encontrado, significa que o login foi bem-sucedido
            res.status(200).json({ message: 'Login bem-sucedido.' });
        } else {
            // Se não encontrar o usuário com esse email e senha, retorna erro de autenticação
            res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
    });
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);  // Mensagem no console indicando que o servidor está rodando
});