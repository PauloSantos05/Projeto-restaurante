// 1. Define o tempo mínimo em milissegundos (2.5 segundos)
const TEMPO_MINIMO = 2500;

// 2. Cria uma promessa que resolve após o tempo mínimo
const cronometro = new Promise(resolve => setTimeout(resolve, TEMPO_MINIMO));

// 3. Cria uma promessa que resolve quando a página carrega 100%
const carregamento = new Promise(resolve => window.addEventListener('load', resolve));

// 4. Executa a transição apenas quando AMBOS os fatores acontecerem
Promise.all([cronometro, carregamento]).then(() => {
    
    // Adiciona uma classe no body para fazer o logotipo sumir suavemente
    document.body.classList.add('fade-out');
    
    // Aguarda o efeito de sumir (0.5s) e muda de página
    setTimeout(() => {
        window.location.href = "login.html"; // Altere para login
    }, 500);
    
});
