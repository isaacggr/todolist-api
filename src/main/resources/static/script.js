// Elementos de navegação principal
const btnEntrar = document.getElementById('btnEntrar');
const btnCadastrar = document.getElementById('btnCadastrar');
const homePage = document.getElementById('homePage');
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const dashboardPage = document.getElementById('dashboardPage');

// Elementos de formulários
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const taskForm = document.getElementById('taskForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// Elementos do Dashboard
const showAddTask = document.getElementById('showAddTask');
const cancelTask = document.getElementById('cancelTask');
const createFirstTask = document.getElementById('createFirstTask');
const addTaskForm = document.getElementById('addTaskForm');
const tasksList = document.getElementById('tasksList');
const emptyTasks = document.getElementById('emptyTasks');
const userName = document.getElementById('userName');

// Variáveis globais
let authToken = '';
let currentUser = null;
let taskDelay = 0; // Para animar as tarefas sequencialmente
let currentFilter = 'todas'; // Filtro atual (todas, concluidas, prioritarias)
let allTasks = []; // Armazenar todas as tarefas para filtragem

// Funções para manipulação de datas
function formatDateTimeForInput(date) {
    // Garantir que a data esteja no formato correto para o input datetime-local
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
}

function formatDateToISO(dateString) {
    const date = new Date(dateString);
    // Retorna a data em formato ISO que o Java Date pode interpretar
    return date.toISOString();
}

function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Verificar se o usuário já está logado (token no localStorage)
function checkAuth() {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
        authToken = storedToken;
        currentUser = JSON.parse(storedUser);
        showDashboard();
    }
}

// Funções de navegação com animações
function showPage(page) {
    // Preparar a animação de saída
    const currentPage = [homePage, loginPage, registerPage, dashboardPage].find(p => p.style.display !== 'none');
    
    if (currentPage) {
        // Animação de saída
        currentPage.style.opacity = '0';
        currentPage.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            // Esconde todas as páginas
            homePage.style.display = 'none';
            loginPage.style.display = 'none';
            registerPage.style.display = 'none';
            dashboardPage.style.display = 'none';
            
            // Resetar estilos para a próxima animação
            currentPage.style.opacity = '';
            currentPage.style.transform = '';
            
            // Mostrar a nova página com animação
            page.style.display = 'block';
            page.style.opacity = '0';
            page.style.transform = 'translateY(20px)';
            
            // Forçar um reflow para que a animação funcione
            void page.offsetWidth;
            
            // Animar a entrada da nova página
            page.style.opacity = '1';
            page.style.transform = 'translateY(0)';
        }, 300);
    } else {
        // Na primeira execução, não há página atual
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        dashboardPage.style.display = 'none';
        
        page.style.display = 'block';
    }
}

function showDashboard() {
    showPage(dashboardPage);
    
    // Atualiza informações do usuário com animação
    if (currentUser) {
        userName.textContent = '';
        const nameText = currentUser.name || currentUser.username;
        
        // Animação de digitação
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < nameText.length) {
                userName.textContent += nameText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
    
    // Carrega as tarefas do usuário
    loadTasks();
    
    // Ajusta os botões de navegação
    document.querySelector('.nav-buttons').innerHTML = `
        <button id="btnLogout" class="btn-secondary">
            <span class="material-icons">logout</span>
            Sair
        </button>
    `;
    document.getElementById('btnLogout').addEventListener('click', logout);
    
    // Adiciona evento para os itens da sidebar
    const sidebarItems = document.querySelectorAll('.sidebar nav li');
    sidebarItems.forEach((item, index) => {
        // Anima a entrada dos itens da sidebar sequencialmente
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 * index);
        
        item.addEventListener('click', () => {
            // Remove a classe active de todos os itens
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Adiciona a classe active ao item clicado
            item.classList.add('active');
        });
    });
}

// Função para filtrar tarefas com base no filtro selecionado
function filterTasks(filter) {
    currentFilter = filter;
    let filteredTasks = [];
    
    switch (filter) {
        case 'todas':
            filteredTasks = allTasks;
            break;
        case 'concluidas':
            filteredTasks = allTasks.filter(task => task.completed);
            break;
        case 'prioritarias':
            filteredTasks = allTasks.filter(task => task.priority === 'ALTA');
            break;
        default:
            filteredTasks = allTasks;
    }
    
    renderTasks(filteredTasks);
    
    // Atualizar visual do menu lateral
    document.querySelectorAll('.sidebar nav li').forEach(item => {
        if (item.getAttribute('data-filter') === filter) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Adicionar evento de inicialização para o menu lateral
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar eventos de clique para as opções do menu lateral
    document.querySelectorAll('.sidebar .menu li').forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterTasks(filter);
        });
    });
});

// Inicializações e Event Listeners
function init() {
    // Aplicar estilos de transição
    const transitionElements = [homePage, loginPage, registerPage, dashboardPage];
    transitionElements.forEach(el => {
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Configurar os itens da sidebar para animação
    const sidebarItems = document.querySelectorAll('.sidebar nav li');
    sidebarItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Navegação
    btnEntrar.addEventListener('click', () => {
        addRippleEffect(btnEntrar);
        setTimeout(() => showPage(loginPage), 300);
    });
    
    btnCadastrar.addEventListener('click', () => {
        addRippleEffect(btnCadastrar);
        setTimeout(() => showPage(registerPage), 300);
    });
    
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(registerPage);
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(loginPage);
    });
    
    // Formulários
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const mode = submitBtn.dataset.mode || 'add';
        const taskId = submitBtn.dataset.taskId;
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="material-icons loading-spinner">sync</span> Salvando...';
        submitBtn.disabled = true;
        
        try {
            const taskData = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                priority: document.getElementById('taskPriority').value,
                startAt: formatDateToISO(document.getElementById('taskStartAt').value),
                endAt: formatDateToISO(document.getElementById('taskEndAt').value)
            };
            
            if (mode === 'edit' && taskId) {
                // Atualizar tarefa existente
                await updateTask(taskId, taskData);
                showNotification('Tarefa atualizada com sucesso!', 'success');
            } else {
                // Criar nova tarefa
                const response = await fetch('/tasks/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${authToken}`
                    },
                    body: JSON.stringify(taskData)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
                
                showNotification('Tarefa adicionada com sucesso!', 'success');
            }
            
            // Animação de sucesso
            submitBtn.innerHTML = '<span class="material-icons success-icon">check_circle</span> Salvo!';
            
            setTimeout(() => {
                // Animar a saída do formulário
                addTaskForm.style.opacity = '0';
                addTaskForm.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    taskForm.reset();
                    addTaskForm.style.display = 'none';
                    
                    // Resetar os estilos para a próxima animação
                    addTaskForm.style.opacity = '';
                    addTaskForm.style.transform = '';
                    
                    // Restaurar o botão
                    submitBtn.innerHTML = 'Adicionar Tarefa';
                    submitBtn.disabled = false;
                    submitBtn.dataset.mode = 'add';
                    submitBtn.dataset.taskId = '';
                    
                    // Recarregar as tarefas
                    loadTasks();
                }, 300);
            }, 800);
            
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Erro ao salvar tarefa:', error);
            
            // Restaurar o botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Interface de tarefas
    showAddTask.addEventListener('click', () => {
        addTaskForm.style.display = 'none';
        addTaskForm.style.opacity = '0';
        addTaskForm.style.transform = 'translateY(-20px)';
        addTaskForm.style.display = 'block';
        
        // Forçar o reflow para que a animação funcione
        void addTaskForm.offsetWidth;
        
        // Animar a entrada do formulário
        addTaskForm.style.opacity = '1';
        addTaskForm.style.transform = 'translateY(0)';
        
        // Inicializa com data/hora atual com fuso horário correto
        const now = new Date();
        document.getElementById('taskStartAt').value = formatDateTimeForInput(now);
        document.getElementById('taskEndAt').value = formatDateTimeForInput(new Date(now.getTime() + 60 * 60 * 1000)); // 1 hora depois
    });
    
    cancelTask.addEventListener('click', () => {
        // Animar a saída do formulário
        addTaskForm.style.opacity = '0';
        addTaskForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            addTaskForm.style.display = 'none';
            taskForm.reset();
            
            // Resetar os estilos para a próxima animação
            addTaskForm.style.opacity = '';
            addTaskForm.style.transform = '';
        }, 300);
    });
    
    createFirstTask.addEventListener('click', () => {
        addTaskForm.style.display = 'block';
        emptyTasks.style.display = 'none';
    });
    
    // Adicionar transições para os formulários
    addTaskForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Verifica autenticação
    checkAuth();
    
    // Adiciona efeitos de hover aos botões
    addButtonHoverEffects();
    
    // Configura eventos do menu lateral
    setupSidebarEvents();
}

// Função para configurar eventos do menu lateral
function setupSidebarEvents() {
    // Adiciona eventos de clique aos elementos de navegação da sidebar
    document.querySelectorAll('.sidebar nav li').forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterTasks(filter);
            
            // Atualiza a classe active visualmente
            document.querySelectorAll('.sidebar nav li').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Efeitos visuais
function addRippleEffect(button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = '0';
    ripple.style.top = '0';
    
    // Reduzindo o tempo de animação para torná-la mais rápida
    ripple.style.animation = 'ripple 0.4s linear';
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

function addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-1px)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mousedown', () => {
            // Reduzindo o fator de escala para uma animação mais sutil
            button.style.transform = 'scale(0.99)';
        });
        
        button.addEventListener('mouseup', () => {
            // Suavizando o retorno ao estado normal
            button.style.transform = '';
        });
    });
}

// Funções de autenticação
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Mostrar estado de loading
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="material-icons loading-spinner">sync</span> Entrando...';
    submitButton.disabled = true;
    
    try {
        // Autenticação com Basic Auth
        authToken = btoa(`${username}:${password}`);
        
        // Usar o novo endpoint específico de verificação de credenciais
        const response = await fetch('/users/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Usuário ou senha incorretos');
        }
        
        // Busca informações do usuário do endpoint de verificação
        const userData = await response.json();
        currentUser = userData;
        
        // Armazena no localStorage para persistir a sessão
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Login realizado com sucesso!', 'success');
        loginForm.reset();
        
        // Pequeno delay para melhor experiência visual
        setTimeout(() => {
            showDashboard();
            // Restaurar o botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 500);
        
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Erro ao fazer login:', error);
        
        // Restaurar o botão após o erro
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Efeito de shake no formulário para indicar erro
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    // Mostrar estado de loading
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="material-icons loading-spinner">sync</span> Cadastrando...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                username,
                password,
                createdAt: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao cadastrar usuário');
        }
        
        showNotification('Cadastro realizado com sucesso! Faça o login para continuar.', 'success');
        registerForm.reset();
        
        // Pequeno delay para melhor experiência visual
        setTimeout(() => {
            showPage(loginPage);
            // Restaurar o botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 500);
        
    } catch (error) {
        showNotification(error.message || 'Usuário já existe ou ocorreu um erro', 'error');
        console.error('Erro ao cadastrar:', error);
        
        // Restaurar o botão após o erro
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Efeito de shake no formulário para indicar erro
        registerForm.classList.add('shake');
        setTimeout(() => registerForm.classList.remove('shake'), 500);
    }
}

function logout() {
    authToken = '';
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    taskForm.reset();
    
    // Animação de logout
    dashboardPage.style.opacity = '0';
    dashboardPage.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        // Restaura botões originais
        document.querySelector('.nav-buttons').innerHTML = `
            <button id="btnEntrar" class="btn-secondary">Entrar</button>
            <button id="btnCadastrar" class="btn-primary">Cadastrar</button>
        `;
        
        // Readiciona eventos de clique
        document.getElementById('btnEntrar').addEventListener('click', () => {
            addRippleEffect(document.getElementById('btnEntrar'));
            setTimeout(() => showPage(loginPage), 300);
        });
        
        document.getElementById('btnCadastrar').addEventListener('click', () => {
            addRippleEffect(document.getElementById('btnCadastrar'));
            setTimeout(() => showPage(registerPage), 300);
        });
        
        // Restaura os estilos para a animação da próxima vez
        dashboardPage.style.opacity = '';
        dashboardPage.style.transform = '';
        
        showPage(homePage);
        showNotification('Você saiu com sucesso!', 'success');
    }, 300);
}

// Funções de gerenciamento de tarefas
async function loadTasks() {
    if (!authToken) return;
    
    try {
        // Mostra um indicador de carregamento
        tasksList.innerHTML = `
            <div class="task-loading">
                <div class="spinner"></div>
                <p>Carregando suas tarefas...</p>
            </div>
        `;
        
        const response = await fetch('/tasks/', {
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }
        
        // Armazena todas as tarefas em uma variável global
        allTasks = await response.json();
        
        // Reseta o delay para animação das tarefas
        taskDelay = 0;
        
        // Filtra as tarefas de acordo com o filtro atual
        filterTasks(currentFilter);
        
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        tasksList.innerHTML = `
            <div class="task-loading">
                <span class="material-icons error-icon">error_outline</span>
                <p>Não foi possível carregar suas tarefas</p>
                <button class="btn-secondary" onclick="loadTasks()">
                    <span class="material-icons">refresh</span> Tentar novamente
                </button>
            </div>
        `;
    }
}

async function updateTask(taskId, updatedData) {
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authToken}`
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const updatedTask = await response.json();
        return updatedTask;
    } catch (error) {
        throw error;
    }
}

async function deleteTask(taskId) {
    if (!authToken) return;
    
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        
        // Retorna true se a exclusão foi bem-sucedida
        return true;
    } catch (error) {
        showNotification(error.message || 'Erro ao excluir tarefa', 'error');
        console.error('Erro ao excluir tarefa:', error);
        return false;
    }
}

async function toggleTaskCompletion(taskId, completed) {
    if (!authToken) return;
    
    try {
        const response = await fetch(`/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authToken}`
            },
            body: JSON.stringify({ completed: completed })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        
        // Retorna a tarefa atualizada
        return await response.json();
    } catch (error) {
        showNotification(error.message || 'Erro ao atualizar status da tarefa', 'error');
        console.error('Erro ao atualizar status da tarefa:', error);
        return null;
    }
}

async function openEditTaskForm(taskId) {
    try {
        // Busca a tarefa específica pelo seu ID
        const tasks = await fetchTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }
        
        // Preenche o formulário com os dados da tarefa
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        
        // Converte datas ISO para formato de input datetime-local
        const startDate = new Date(task.startAt);
        const endDate = new Date(task.endAt);
        document.getElementById('taskStartAt').value = formatDateTimeForInput(startDate);
        document.getElementById('taskEndAt').value = formatDateTimeForInput(endDate);
        
        // Altera o formulário para modo de edição
        const submitBtn = taskForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Atualizar';
        submitBtn.dataset.mode = 'edit';
        submitBtn.dataset.taskId = taskId;
        
        // Mostra o formulário
        addTaskForm.style.display = 'block';
        // Animar a entrada do formulário
        addTaskForm.style.opacity = '0';
        addTaskForm.style.transform = 'translateY(-20px)';
        void addTaskForm.offsetWidth; // Force reflow
        addTaskForm.style.opacity = '1';
        addTaskForm.style.transform = 'translateY(0)';
        
        // Rola até o formulário
        addTaskForm.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Erro ao carregar tarefa para edição:', error);
    }
}

async function fetchTasks() {
    if (!authToken) return [];
    
    try {
        const response = await fetch('/tasks/', {
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        return [];
    }
}

async function handleTaskAction(taskId, action) {
    if (!authToken) return;
    
    try {
        // Adicionar efeito visual ao botão
        const button = document.querySelector(`button[data-id="${taskId}"][class*="btn-${action}"]`);
        if (button) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 300);
        }
        
        // Mostrar animação no card da tarefa
        const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
        
        if (action === 'delete') {
            // Chamar a API para excluir a tarefa
            const deleted = await deleteTask(taskId);
            
            if (deleted) {
                // Animação de exclusão
                if (taskCard) {
                    taskCard.style.opacity = '0';
                    taskCard.style.transform = 'translateX(100px)';
                    setTimeout(() => {
                        taskCard.remove();
                        
                        // Verificar se não há mais tarefas
                        if (tasksList.querySelectorAll('.task-card').length === 0) {
                            emptyTasks.style.display = 'block';
                        }
                    }, 300);
                }
                
                showNotification('Tarefa excluída com sucesso!', 'success');
            }
            
        } else if (action === 'complete') {
            // Obter o estado atual da tarefa
            const isCompleted = taskCard.classList.contains('completed');
            // Inverter o status
            const newCompletedStatus = !isCompleted;
            
            // Chamar a API para atualizar o status
            const updatedTask = await toggleTaskCompletion(taskId, newCompletedStatus);
            
            if (updatedTask) {
                if (newCompletedStatus) { // Marcando como concluída
                    // Animação de conclusão
                    taskCard.style.opacity = '0.7';
                    taskCard.classList.add('completed');
                    
                    // Adicionar marca de concluído
                    const taskHeader = taskCard.querySelector('.task-header');
                    if (!taskHeader.querySelector('.completed-badge')) {
                        const completedBadge = document.createElement('div');
                        completedBadge.className = 'completed-badge';
                        completedBadge.innerHTML = '<span class="material-icons">check_circle</span> Concluído';
                        taskHeader.appendChild(completedBadge);
                    }
                    
                    // Atualizar o ícone do botão
                    button.innerHTML = '<span class="material-icons">replay</span>';
                    button.setAttribute('title', 'Marcar como não concluída');
                    
                    showNotification('Tarefa marcada como concluída!', 'success');
                } else { // Desmarcando como concluída
                    // Remover efeito de conclusão
                    taskCard.style.opacity = '1';
                    taskCard.classList.remove('completed');
                    
                    // Remover marca de concluído
                    const completedBadge = taskCard.querySelector('.completed-badge');
                    if (completedBadge) {
                        completedBadge.remove();
                    }
                    
                    // Restaurar o ícone do botão
                    button.innerHTML = '<span class="material-icons">check_circle</span>';
                    button.setAttribute('title', 'Marcar como concluída');
                    
                    showNotification('Tarefa marcada como não concluída', 'info');
                }
            }
        } else if (action === 'edit') {
            // Animação de highlight para edição
            if (taskCard) {
                taskCard.classList.add('highlight');
                setTimeout(() => taskCard.classList.remove('highlight'), 1000);
            }
            
            // Abrir o formulário de edição
            openEditTaskForm(taskId);
        }
    } catch (error) {
        showNotification('Erro na operação', 'error');
        console.error('Erro na operação de tarefa:', error);
    }
}

function renderTasks(tasks) {
    // Limpa o estado de carregamento
    tasksList.innerHTML = '';
    
    // Remove mensagem de estado vazio se tiver tarefas
    emptyTasks.style.display = tasks.length ? 'none' : 'block';
    
    // Adiciona as tarefas com animação sequencial
    tasks.forEach((task, index) => {
        setTimeout(() => {
            const taskElement = createTaskElement(task);
            tasksList.appendChild(taskElement);
            
            // Animar a entrada da tarefa
            setTimeout(() => {
                taskElement.style.opacity = '1';
                taskElement.style.transform = 'translateY(0)';
            }, 50);
        }, taskDelay);
        
        // Aumenta o delay para a próxima tarefa
        taskDelay += 100;
    });
}

function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card priority-${task.priority}`;
    if (task.completed) {
        taskCard.classList.add('completed');
        taskCard.style.opacity = '0.7';
    }
    taskCard.setAttribute('data-id', task.id);
    
    // Configurar para animação
    taskCard.style.opacity = '0';
    taskCard.style.transform = 'translateY(20px)';
    taskCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Formata as datas com fuso horário correto
    const startDate = formatDateForDisplay(task.startAt);
    const endDate = formatDateForDisplay(task.endAt);
    
    // Preparar o HTML do badge de conclusão para tarefas concluídas
    const completedBadgeHTML = task.completed ? 
        `<div class="completed-badge"><span class="material-icons">check_circle</span> Concluído</div>` : '';
    
    // Preparar o ícone do botão de conclusão com base no status atual
    const completeButtonIcon = task.completed ? 'replay' : 'check_circle';
    const completeButtonTitle = task.completed ? 'Marcar como não concluída' : 'Marcar como concluída';
    
    taskCard.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            <div class="task-priority priority-${task.priority}">${formatPriority(task.priority)}</div>
            ${completedBadgeHTML}
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-dates">
            <div><span class="material-icons">event_available</span> ${startDate}</div>
            <div><span class="material-icons">event_busy</span> ${endDate}</div>
        </div>
        <div class="task-actions">
            <button class="btn-edit" data-id="${task.id}" title="Editar tarefa"><span class="material-icons">edit</span></button>
            <button class="btn-complete" data-id="${task.id}" title="${completeButtonTitle}"><span class="material-icons">${completeButtonIcon}</span></button>
            <button class="btn-delete" data-id="${task.id}" title="Excluir tarefa"><span class="material-icons">delete</span></button>
        </div>
    `;
    
    // Adiciona event listeners para os botões
    const btnEdit = taskCard.querySelector('.btn-edit');
    const btnComplete = taskCard.querySelector('.btn-complete');
    const btnDelete = taskCard.querySelector('.btn-delete');
    
    btnEdit.addEventListener('click', () => handleTaskAction(task.id, 'edit'));
    btnComplete.addEventListener('click', () => handleTaskAction(task.id, 'complete'));
    btnDelete.addEventListener('click', () => handleTaskAction(task.id, 'delete'));
    
    return taskCard;
}

// Funções utilitárias
function formatPriority(priority) {
    const priorities = {
        'ALTA': 'Alta',
        'MEDIA': 'Média',
        'BAIXA': 'Baixa'
    };
    return priorities[priority] || priority;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Remover qualquer animação anterior
    notification.style.animation = 'none';
    
    // Forçar reflow
    void notification.offsetWidth;
    
    // Adicionar nova animação
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Adiciona a classe de animação de shake para formulários
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .loading-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .completed {
            border-left-color: #00c851 !important;
        }
        
        .completed-badge {
            background: rgba(0, 200, 81, 0.1);
            color: #00c851;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-left: 10px;
            animation: fadeIn 0.5s ease-out;
        }
        
        .highlight {
            animation: highlight 1s ease;
        }
        
        @keyframes highlight {
            0% { box-shadow: 0 0 0 0 rgba(72, 99, 247, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(72, 99, 247, 0); }
            100% { box-shadow: 0 0 0 0 rgba(72, 99, 247, 0); }
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto 20px auto;
            border: 4px solid rgba(72, 99, 247, 0.2);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .task-loading {
            text-align: center;
            padding: 40px 0;
            color: var(--dark-gray);
        }
        
        .error-icon {
            color: var(--danger-color);
            font-size: 40px;
            margin-bottom: 10px;
        }
        
        .success-icon {
            color: var(--success-color);
        }
    </style>
`);

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);