// ハンバーガーメニューの制御
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // メニューリンクをクリックしたときにメニューを閉じる
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// スクロール時のヘッダー背景変更
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(30, 60, 114, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        header.style.backdropFilter = 'none';
    }
});

// 要素が画面に入ったときのアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
document.querySelectorAll('.news-item, .gallery-item, .join-item').forEach(el => {
    observer.observe(el);
});

// フォームバリデーション（お問い合わせページで使用）
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'この項目は必須です';
                errorElement.style.display = 'block';
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        // メールアドレスの形式チェック
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = '正しいメールアドレスを入力してください';
                    errorElement.style.display = 'block';
                }
            }
        }
        
        // 電話番号の形式チェック
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[\d\-\(\)\+\s]+$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = '正しい電話番号を入力してください';
                    errorElement.style.display = 'block';
                }
            }
        }
    });
    
    return isValid;
}

// 寄付金額の計算（募金ページで使用）
function calculateDonation() {
    const amountSelect = document.getElementById('donation-amount');
    const customAmount = document.getElementById('custom-amount');
    const totalDisplay = document.getElementById('total-amount');
    
    if (amountSelect && totalDisplay) {
        let amount = 0;
        
        if (amountSelect.value === 'custom' && customAmount) {
            amount = parseInt(customAmount.value) || 0;
        } else {
            amount = parseInt(amountSelect.value) || 0;
        }
        
        totalDisplay.textContent = amount.toLocaleString() + '円';
    }
}

// プログレスバーのアニメーション
function animateProgressBar(progressBar, targetPercentage) {
    let currentPercentage = 0;
    const increment = targetPercentage / 100;
    
    const timer = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(timer);
        }
        
        progressBar.style.width = currentPercentage + '%';
        progressBar.textContent = Math.round(currentPercentage) + '%';
    }, 20);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // プログレスバーのアニメーション実行
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const targetPercentage = parseInt(bar.dataset.percentage) || 0;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBar(bar, targetPercentage);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    });
    
    // 寄付金額の変更イベント
    const amountSelect = document.getElementById('donation-amount');
    const customAmount = document.getElementById('custom-amount');
    
    if (amountSelect) {
        amountSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customAmount.style.display = 'block';
                customAmount.focus();
            } else {
                customAmount.style.display = 'none';
            }
            calculateDonation();
        });
    }
    
    if (customAmount) {
        customAmount.addEventListener('input', calculateDonation);
    }
});

// ローディング画面の制御
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// 画像の遅延読み込み
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}