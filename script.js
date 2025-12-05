/* =================================================================
   НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ
   ================================================================= */
const USER_CONFIG = {
    links: {
        telegram: "https://t.me/heylou0",
        steam: "https://steamcommunity.com/profiles/76561198022636049/"
    },
    images: {
        banner: "https://x0.at/sRla.jpg",
        avatar: "https://x0.at/Ba2D.jpg"
    },
    backgrounds: [
        "https://x0.at/VTxX.jpg",
        "https://x0.at/MofV.jpg",
        "https://x0.at/UAk3.jpg"
    ],
    widgetPlayer: {
        audioFile: "https://media.vocaroo.com/mp3/1dg2M5LkeVAK", 
        coverArt: "https://x0.at/Ba2D.jpg", 
        trackName: "overtonight — mirrors demo"
    }
};

/* =================================================================
   ЛОГИКА
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Установка данных
    document.getElementById('profile-banner').src = USER_CONFIG.images.banner;
    document.getElementById('profile-avatar').src = USER_CONFIG.images.avatar;
    document.getElementById('tg-link').href = USER_CONFIG.links.telegram;
    document.getElementById('steam-link').href = USER_CONFIG.links.steam;
    
    const tgUsername = USER_CONFIG.links.telegram.split('/').pop();
    const tgTextLink = document.getElementById('tg-text-link');
    tgTextLink.href = USER_CONFIG.links.telegram;
    tgTextLink.textContent = '@' + tgUsername;

    const trackNameEl = document.getElementById('widget-track-name');
    const audio = document.getElementById('bg-music');
    const playIcon = document.querySelector('#play-pause-btn i');

    audio.src = USER_CONFIG.widgetPlayer.audioFile;
    document.getElementById('widget-art').src = USER_CONFIG.widgetPlayer.coverArt;
    
    // --- ОБНОВЛЕННАЯ ЛОГИКА ТЕКСТА (БЕСКОНЕЧНАЯ ПРОКРУТКА) ---
    const trackText = USER_CONFIG.widgetPlayer.trackName;
    trackNameEl.textContent = trackText; // Сначала ставим просто текст для замера

    setTimeout(() => {
        const containerWidth = document.querySelector('.track-info').clientWidth;
        const textWidth = trackNameEl.scrollWidth;

        // Если текст длиннее контейнера (или почти такой же)
        if (textWidth > (containerWidth - 20)) { 
            // Дублируем текст внутри элемента: "Название <отступ> Название"
            // Это нужно для бесконечного эффекта
            trackNameEl.innerHTML = `<span>${trackText}</span><span class="duplicate">${trackText}</span>`;
            trackNameEl.classList.add('scrolling');
        }
    }, 100);

    // 2. АГРЕССИВНЫЙ АВТОЗАПУСК
    audio.volume = 0.3;
    
    const updateIcon = () => {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    };

    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            updateIcon();
        }).catch(error => {
            const forcePlay = () => {
                audio.play();
                updateIcon();
                ['click', 'mousemove', 'touchstart', 'scroll', 'keydown'].forEach(evt => 
                    document.removeEventListener(evt, forcePlay)
                );
            };
            ['click', 'mousemove', 'touchstart', 'scroll', 'keydown'].forEach(evt => 
                document.addEventListener(evt, forcePlay, { once: true })
            );
        });
    }

    // 3. УМНЫЙ ВИЗУАЛИЗАТОР
    const bars = document.querySelectorAll('.wave-icon span');
    
    function animateVisualizer() {
        if (!audio.paused) {
            bars.forEach(bar => {
                const minHeight = 10;
                const maxHeight = 100;
                const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
                bar.style.height = `${height * (audio.volume + 0.5)}%`; 
            });
        } else {
            bars.forEach(bar => {
                bar.style.height = '15%';
            });
        }
        setTimeout(() => requestAnimationFrame(animateVisualizer), 60);
    }
    
    animateVisualizer();
});


/* 3. 3D НАКЛОН */
const wrapper = document.querySelector('.tilt-wrapper');
const container = document.querySelector('.container');
const constraint = 25; 

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

function animateTilt(e) {
    if (isMobile) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let rotateX = -(y / constraint).toFixed(2);
    let rotateY = (x / constraint).toFixed(2);
    wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt() {
    if (isMobile) return;
    wrapper.style.transform = 'none';
}

container.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(() => animateTilt(e));
});
container.addEventListener('mouseleave', resetTilt);


/* 4. УПРАВЛЕНИЕ ПЛЕЕРОМ */
const musicTrigger = document.getElementById('music-trigger');
const musicBar = document.getElementById('music-player-bar');
const closePlayerBtn = document.getElementById('close-player-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const audio = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');
const playIcon = playPauseBtn.querySelector('i');

musicTrigger.addEventListener('click', () => {
    musicBar.classList.add('active');
    musicTrigger.style.opacity = '0';
});
closePlayerBtn.addEventListener('click', () => {
    musicBar.classList.remove('active');
    setTimeout(() => { musicTrigger.style.opacity = '1'; }, 300);
});
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
});
volumeSlider.addEventListener('input', (e) => audio.volume = e.target.value);


/* 5. СМЕНА ФОНА */
let currentBgIndex = 0;
const bgElement = document.querySelector('.bg-image');
const changeBgBtn = document.getElementById('change-bg-btn');

function setBackground(index) {
    const bgUrl = USER_CONFIG.backgrounds[index];
    bgElement.style.backgroundImage = `url('${bgUrl}')`;
    localStorage.setItem('haylou_bg_index', index);
}
const savedIndex = localStorage.getItem('haylou_bg_index');
if (savedIndex !== null) {
    currentBgIndex = parseInt(savedIndex);
    if (currentBgIndex >= USER_CONFIG.backgrounds.length) currentBgIndex = 0;
}
setBackground(currentBgIndex);

changeBgBtn.addEventListener('click', () => {
    currentBgIndex++;
    if (currentBgIndex >= USER_CONFIG.backgrounds.length) currentBgIndex = 0;
    setBackground(currentBgIndex);
});


/* 6. ЧАСТИЦЫ */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    init();
}

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() * 1) - 0.5;
        this.speedY = (Math.random() * 1) - 0.5;
        this.color = `rgba(40, 100, 255, ${Math.random() * 0.5 + 0.1})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.005;
        if (this.size <= 0.1) {
             this.x = Math.random() * window.innerWidth;
             this.y = Math.random() * window.innerHeight;
             this.size = Math.random() * 2;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    const count = isMobile ? 40 : 80;
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

resizeCanvas();
animate();
window.addEventListener('resize', resizeCanvas);


/* 7. ПРЕЛОАДЕР */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
