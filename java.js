document.addEventListener('DOMContentLoaded', () => {
    // === Elementleri Seçme ===
    const menuIcon = document.querySelector('.menu-icon');
    const navPanel = document.querySelector('.nav-panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPages = document.querySelectorAll('.content-page');
    const videoIframe = document.getElementById('video-iframe');
    const timerText = document.getElementById('timer-text');
    const startButton = document.getElementById('start-button');
    const completedButton = document.getElementById('completed-button');
    const rewardMessage = document.getElementById('reward-message');
    const prevVideoButton = document.getElementById('prev-video');
    const nextVideoButton = document.getElementById('next-video');
    const selectionButtons = document.querySelectorAll('.selection-button');
    const subscriptionButtons = document.querySelectorAll('.subscription-button');
    const likeButtons = document.querySelectorAll('.like-button');

    // === Değişkenler ===
    let player;
    let timerInterval;
    let selectedDuration = 0;
    let selectedReward = 0;
    let currentVideoIndex = 0;
    const videoList = ["L_jWHffIx5E", "dQw4w9WgXcQ", "3JZ_D3ELwOQ"]; // İzletilecek YouTube video ID'leri

    // === Fonksiyonlar ===

    // Belirtilen ID'ye sahip sayfayı gösterir
    function showPage(pageId) {
        contentPages.forEach(page => { page.classList.remove('active'); });
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) { pageToShow.classList.add('active'); }
        if (pageId === 'anasayfa' && typeof particlesJS === 'function') {
            initParticles();
        }
    }

    // Aktif navigasyon linkini günceller
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // YouTube IFrame API'si hazır olduğunda bu fonksiyon çalışır
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('video-iframe', {
            events: {
                'onReady': () => console.log("YouTube Oynatıcı hazır."),
                'onError': (e) => {
                    console.error("YouTube Hatası: ", e.data);
                    alert('Video yüklenemedi, sonraki videoya geçiliyor.');
                    loadNextVideo();
                },
                'onStateChange': (e) => {
                    if (e.data === YT.PlayerState.CUED) { // Video yüklendiğinde başlat butonunu göster
                        startButton.classList.add('active');
                    }
                }
            }
        });
    };

    // Saniyeyi "dakika:saniye" formatına çevirir
    function formatTime(s) {
        const m = Math.floor(s / 60);
        const rs = s % 60;
        return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
    }

    // Video izleme sürecini hazırlar
    function prepareVideoProcess() {
        showPage('video-izle-section');
        updateActiveNavLink('izle-kazan-section'); // Bu kısım dinamik hale getirilebilir
        if (videoList.length === 0) {
            alert("İzlenecek video kalmadı.");
            showPage('izle-kazan-section');
            return;
        }
        if (player && typeof player.loadVideoById === 'function') {
            player.loadVideoById(videoList[currentVideoIndex]);
        }
        timerText.textContent = formatTime(selectedDuration);
        timerText.className = 'timer-display timer-normal';
        startButton.classList.remove('active');
        completedButton.classList.remove('active');
        completedButton.setAttribute('disabled', 'disabled');
    }

    // Zamanlayıcıyı başlatır
    function startTimer() {
        let timeLeft = selectedDuration;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerText.textContent = formatTime(timeLeft);
            // Zamanlayıcı rengini kalan süreye göre değiştir
            if (timeLeft <= 3) { timerText.className = 'timer-display timer-critical'; } 
            else if (timeLeft <= 10) { timerText.className = 'timer-display timer-warning'; }
            else { timerText.className = 'timer-display timer-normal'; }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerText.textContent = "Tamamlandı!";
                completedButton.classList.add('active');
                completedButton.removeAttribute('disabled');
                if (player && typeof player.pauseVideo === 'function') {
                    player.pauseVideo();
                }
            }
        }, 1000);
    }

    // Sonraki videoyu yükler
    function loadNextVideo() {
        clearInterval(timerInterval);
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        prepareVideoProcess();
    }
    
    // Önceki videoyu yükler
    function loadPrevVideo() {
        clearInterval(timerInterval);
        currentVideoIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
        prepareVideoProcess();
    }

    // Arka plan partikül animasyonunu başlatır
    function initParticles() {
        if(document.getElementById('particles-js')) {
            particlesJS('particles-js', { "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "star", "stroke": { "width": 0, "color": "#000000" } }, "opacity": { "value": 0.5 }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6, "direction": "none", "out_mode": "out" } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } }, "modes": { "repulse": { "distance": 100 }, "push": { "particles_nb": 4 } } }, "retina_detect": true });
        }
    }


    // === Olay Dinleyicileri (Event Listeners) ===

    // Sol menüyü açıp kapatma
    menuIcon.addEventListener('click', () => {
        navPanel.classList.toggle('open');
        menuIcon.classList.toggle('open');
    });

    // Navigasyon linklerine tıklandığında ilgili sayfayı göster
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showPage(targetId);
            updateActiveNavLink(targetId);
            navPanel.classList.remove('open');
            menuIcon.classList.remove('open');
        });
    });

    // "İzle ve Kazan" butonları
    selectionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            selectedDuration = parseInt(button.dataset.duration);
            selectedReward = parseInt(button.dataset.reward);
            completedButton.textContent = "İzle ve Kazan";
            prepareVideoProcess();
        });
    });

    // "Abone Ol ve Kazan" butonları
    subscriptionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            selectedDuration = parseInt(button.dataset.duration);
            selectedReward = parseInt(button.dataset.reward);
            completedButton.textContent = "Abone Ol ve Kazan";
            prepareVideoProcess();
        });
    });

    // "Beğen ve Kazan" butonları
    likeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            selectedDuration = parseInt(button.dataset.duration);
            selectedReward = parseInt(button.dataset.reward);
            completedButton.textContent = "Beğen ve Kazan";
            prepareVideoProcess();
        });
    });

    // Video başlatma butonu
    startButton.addEventListener('click', () => {
        if (player && typeof player.playVideo === 'function') {
            startButton.classList.remove('active');
            player.playVideo();
            startTimer();
        }
    });

    // "Tamamlandı" butonu
    completedButton.addEventListener('click', () => {
        if (!completedButton.classList.contains('active')) return;
        rewardMessage.querySelector('span').textContent = `+${selectedReward} Coin Kazandın!`;
        rewardMessage.classList.add('show');
        // 3 saniye sonra mesajı gizle ve sonraki videoyu yükle
        setTimeout(() => {
            rewardMessage.classList.remove('show');
            loadNextVideo();
        }, 3000);
    });
    
    // Sonraki/Önceki video butonları
    nextVideoButton.addEventListener('click', loadNextVideo);
    prevVideoButton.addEventListener('click', loadPrevVideo);


    // === Sayfa İlk Yüklendiğinde ===
    showPage('anasayfa');
    updateActiveNavLink('anasayfa');
});