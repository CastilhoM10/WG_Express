document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Menu Mobile Full-Screen Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Trava o scroll do body quando o menu está aberto
        if(navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    mobileBtn.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar num link (apenas no mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                toggleMenu();
            }
        });
    });

    // 2. Highlighting Sidebar Menu (Desktop)
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 992) {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 300)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 3. Intersection Observer (Animações Padrão e Cards Alternados Mobile)
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay para elementos genéricos no desktop. 
                // Para os cards mobile, o delay cria um efeito legal de escada.
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, (index % 3) * 100); // Modulo 3 para não atrasar muito se rolar rápido
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona as animações normais E os cards com animação especial
    document.querySelectorAll('.animate-on-scroll, .card-anim').forEach(el => {
        scrollObserver.observe(el);
    });

    // 4. Contador de Estatísticas Animado
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2500; 
                const increment = target / (duration / 16); 

                let currentCount = 0;
                const updateCounter = () => {
                    currentCount += increment;
                    if (currentCount < target) {
                        counter.textContent = Math.ceil(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // 5. Ano Dinâmico Footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 6. Segurança Extrema no Formulário (Sem innerHTML, prevenção XSS)
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str; 
        return temp.innerHTML;
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const rawNome = document.getElementById('nome').value.trim();
        const rawEmail = document.getElementById('email').value.trim();
        const rawMensagem = document.getElementById('mensagem').value.trim();

        if (rawNome.length > 100 || rawEmail.length > 150 || rawMensagem.length > 500) {
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent = 'Erro de sistema: Limite de caracteres excedido.';
            return;
        }

        const safeNome = sanitizeHTML(rawNome);
        const safeEmail = sanitizeHTML(rawEmail);
        const safeMensagem = sanitizeHTML(rawMensagem);

        if (!safeNome || !safeEmail || !safeMensagem) {
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent = 'Por favor, preencha todos os campos.';
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

        setTimeout(() => {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = `Proposta solicitada com sucesso, ${safeNome.split(' ')[0]}!`;
            
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            setTimeout(() => { 
                formFeedback.style.display = 'none'; 
                formFeedback.className = 'form-feedback'; 
            }, 5000);
        }, 1500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica de Troca de Abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove ativo de todos os botões e conteúdos
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Fecha todas as caixas 3D abertas ao trocar de aba
            document.querySelectorAll('.caixa-3d-wrapper').forEach(cx => cx.classList.remove('aberta'));

            // Adiciona ativo ao botão clicado e à aba correspondente
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // 2. Lógica das Caixas 3D (Unboxing)
    // Usamos delegação de evento para funcionar mesmo após a troca de abas
    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.caixa-3d-wrapper');
        if (wrapper) {
            // Fecha outras caixas na mesma aba
            const currentTab = wrapper.closest('.tab-content');
            currentTab.querySelectorAll('.caixa-3d-wrapper').forEach(c => {
                if(c !== wrapper) c.classList.remove('aberta');
            });
            
            wrapper.classList.toggle('aberta');
        }
    });
});