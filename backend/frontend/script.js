// Função para registrar um novo usuário
function signup() {
    // Pega o valor do campo de email do formulário de signup
    const email = document.getElementById('signup-email').value;
    
    // Pega o valor do campo de senha do formulário de signup
    const password = document.getElementById('signup-password').value;

    // Envia os dados de email e senha para o servidor
    fetch('/signup', {
        method: 'POST',  // Especifica que a requisição será do tipo POST
        headers: { 'Content-Type': 'application/json' },  // Informa que o corpo da requisição será em formato JSON
        body: JSON.stringify({ email, password }),  // Converte os dados de email e senha para JSON e coloca no corpo da requisição
    })
        // Se a resposta for bem-sucedida, converte a resposta em JSON
        .then(response => response.json())
        .then(data => {
            // Se a resposta contiver um erro, exibe uma mensagem de erro
            if (data.error) {
                alert(`Erro: ${data.error}`);
            } else {
                // Se não houver erro, exibe uma mensagem de sucesso
                alert('Usuário cadastrado com sucesso!');
            }
        })
        // Se ocorrer algum erro na requisição ou no processamento da resposta
        .catch(error => {
            console.error('Erro:', error);  // Exibe o erro no console
            alert('Erro ao conectar ao servidor.');  // Exibe um alerta informando o erro
        });
}

// Função para realizar o login de um usuário
function login() {
    // Pega o valor do campo de email do formulário de login
    const email = document.getElementById('login-email').value;

    // Pega o valor do campo de senha do formulário de login
    const password = document.getElementById('login-password').value;

    // Envia os dados de email e senha para o servidor
    fetch('/login', {
        method: 'POST',  // Especifica que a requisição será do tipo POST
        headers: { 'Content-Type': 'application/json' },  // Informa que o corpo da requisição será em formato JSON
        body: JSON.stringify({ email, password }),  // Converte os dados de email e senha para JSON e coloca no corpo da requisição
    })
        // Se a resposta for bem-sucedida, converte a resposta em JSON
        .then(response => response.json())
        .then(data => {
            // Se a resposta contiver um erro, exibe uma mensagem de erro
            if (data.error) {
                alert(`Erro: ${data.error}`);
            } else {
                // Se o login for bem-sucedido, exibe uma mensagem e redireciona o usuário para a página de boas-vindas
                window.location.href = ('/welcome.html');  // Redireciona o usuário para a página 'welcome.html'
            }
        })
        // Se ocorrer algum erro na requisição ou no processamento da resposta
        .catch(error => {
            console.error('Erro:', error);  // Exibe o erro no console
            alert('Erro ao conectar ao servidor.');  // Exibe um alerta informando o erro
        });
}
