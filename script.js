// Elemen DOM
const selectionSection = document.getElementById('selectionSection');
const comparisonSection = document.getElementById('comparisonSection');
const comparisonTable = document.getElementById('comparisonTable');
const compareBtn = document.getElementById('compareBtn');
const changeSelectionBtn = document.getElementById('changeSelection');
const aiGrid = document.getElementById('aiGrid');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const searchBar = document.getElementById('searchBar');
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterPanel = document.getElementById('filterPanel');
const filterTags = document.getElementById('filterTags');
const activeFilters = document.getElementById('activeFilters');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const featuresGrid = document.getElementById('featuresGrid');
const popularSearchBar = document.getElementById('popularSearchBar');

// Array untuk menyimpan AI yang dipilih
let selectedAIs = [];
let activeFilterTags = [];
let allTags = [];

// Dashboard State
let selectedDashboardModels = [];
let currentChartMetric = 'intelligence';

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Toggle filter panel
filterToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterPanel.classList.toggle('show');
    filterToggleBtn.classList.toggle('active');
});

// Tutup filter panel ketika klik di luar
document.addEventListener('click', (e) => {
    if (!filterPanel.contains(e.target) && !filterToggleBtn.contains(e.target)) {
        filterPanel.classList.remove('show');
        filterToggleBtn.classList.remove('active');
    }
});

// Fungsi untuk mengumpulkan semua tag unik dari data AI
function collectAllTags() {
    const tagsSet = new Set();
    
    for (const ai of Object.values(aiData)) {
        ai.tags.forEach(tag => tagsSet.add(tag));
    }
    
    return Array.from(tagsSet).sort();
}

// Fungsi untuk membuat filter tag
function createFilterTags() {
    allTags = collectAllTags();
    
    allTags.forEach(tag => {
        const tagElement = document.createElement('button');
        tagElement.className = 'filter-tag';
        tagElement.innerHTML = `<i class="fas fa-tag"></i> ${tag}`;
        tagElement.dataset.tag = tag;
        
        tagElement.addEventListener('click', () => toggleFilterTag(tag));
        
        filterTags.appendChild(tagElement);
    });
}

// Fungsi untuk toggle filter tag
function toggleFilterTag(tag) {
    const tagElement = document.querySelector(`.filter-tag[data-tag="${tag}"]`);
    
    if (activeFilterTags.includes(tag)) {
        // Hapus tag dari filter aktif
        activeFilterTags = activeFilterTags.filter(t => t !== tag);
        tagElement.classList.remove('active');
    } else {
        // Tambah tag ke filter aktif
        activeFilterTags.push(tag);
        tagElement.classList.add('active');
    }
    
    updateActiveFiltersDisplay();
    filterAICards();
}

// Fungsi untuk memperbarui tampilan filter aktif
function updateActiveFiltersDisplay() {
    activeFilters.innerHTML = '';
    
    if (activeFilterTags.length === 0) {
        return;
    }
    
    activeFilterTags.forEach(tag => {
        const activeFilter = document.createElement('div');
        activeFilter.className = 'active-filter';
        activeFilter.innerHTML = `<i class="fas fa-filter"></i> ${tag}`;
        activeFilters.appendChild(activeFilter);
    });
    
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-filters';
    clearButton.innerHTML = '<i class="fas fa-times"></i> Clear All';
    clearButton.addEventListener('click', clearAllFilters);
    activeFilters.appendChild(clearButton);
}

// Fungsi untuk menghapus semua filter
function clearAllFilters() {
    activeFilterTags = [];
    
    // Reset semua tag button
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    
    updateActiveFiltersDisplay();
    filterAICards();
}

// Fungsi untuk memfilter kartu AI berdasarkan pencarian dan tag
function filterAICards() {
    const searchTerm = searchBar.value.toLowerCase().trim();
    const aiCards = aiGrid.querySelectorAll('.ai-card');
    
    aiCards.forEach(card => {
        const aiKey = card.dataset.aiKey;
        const ai = aiData[aiKey];
        const aiName = ai.name.toLowerCase();
        const aiDescription = ai.description.toLowerCase();
        const aiTags = ai.tags.map(tag => tag.toLowerCase());
        
        const matchesSearch = searchTerm === '' || 
                            aiName.includes(searchTerm) || 
                            aiDescription.includes(searchTerm) ||
                            ai.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesTags = activeFilterTags.length === 0 || 
                          activeFilterTags.some(tag => aiTags.includes(tag.toLowerCase()));
        
        if (matchesSearch && matchesTags) {
            card.classList.remove('hidden');
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
}

// Fungsi untuk memfilter AI populer
function filterPopularAI() {
    const searchTerm = popularSearchBar.value.toLowerCase().trim();
    const featureCards = featuresGrid.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const aiName = card.dataset.aiName;
        
        if (aiName.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Fungsi untuk membuat kartu AI populer di Features Section
function createPopularAICards() {
    featuresGrid.innerHTML = '';
    
    // Ambil hanya AI yang ditandai sebagai popular dari aiData
    const popularAIs = Object.values(aiData).filter(ai => ai.isPopular);
    
    popularAIs.forEach(ai => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.dataset.aiName = ai.name.toLowerCase();
        
        // Check if logo is emoji
        const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(ai.logo);
        const logoClass = isEmoji ? 'emoji-logo' : '';
        
        card.innerHTML = `
            <div class="feature-image" style="background: ${ai.gradient};">
                <div class="ai-logo ${logoClass}" style="background: ${ai.gradient};">${ai.logo}</div>
            </div>
            <div class="feature-content">
                <span class="feature-badge">${ai.category}</span>
                <h3>${ai.name}</h3>
                <p>${ai.description} <span class="feature-highlight">${ai.strength}</span>.</p>
                <a href="${ai.link}" target="_blank" class="btn-try">Coba Sekarang</a>
            </div>
        `;
        
        featuresGrid.appendChild(card);
    });
}

// Fungsi untuk membuat kartu AI di Compare Section
function createAICards() {
    // Tampilkan AI populer terlebih dahulu (grid 3x3)
    const popularAIs = Object.entries(aiData)
        .filter(([key, ai]) => ai.isPopular)
        .slice(0, 9);
    
    // Tampilkan AI lainnya
    const otherAIs = Object.entries(aiData)
        .filter(([key, ai]) => !ai.isPopular);
    
    // Gabungkan semua AI (populer dulu, lalu lainnya)
    const allAIs = [...popularAIs, ...otherAIs];
    
    allAIs.forEach(([key, ai]) => {
        const card = document.createElement('div');
        card.className = 'ai-card';
        card.dataset.aiKey = key;
        card.dataset.aiName = ai.name.toLowerCase();
        
        // Check if logo is emoji
        const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(ai.logo);
        const logoClass = isEmoji ? `${ai.logoClass} emoji-logo` : ai.logoClass;
        
        // Tandai AI yang tidak populer sebagai hidden
        if (!ai.isPopular) {
            card.classList.add('hidden');
        }
        
        card.innerHTML = `
            <div class="ai-card-header">
                <div class="ai-logo-compare ${logoClass}" style="background: ${ai.gradient}">${ai.logo}</div>
                <div>
                    <div class="ai-name">${ai.name}</div>
                    <div class="ai-category">${ai.category}</div>
                </div>
            </div>
            <div class="ai-description">${ai.description}</div>
            <div class="ai-tags">
                ${ai.tags.map(tag => `<span class="ai-tag">${tag}</span>`).join('')}
            </div>
            <div class="ai-price">${ai.price}</div>
        `;
        
        card.addEventListener('click', () => toggleAISelection(key, card));
        aiGrid.appendChild(card);
    });
}

// Fungsi untuk memilih/membatalkan pilihan AI
function toggleAISelection(aiKey, card) {
    const index = selectedAIs.indexOf(aiKey);
    
    if (index === -1) {
        // Jika belum dipilih dan belum mencapai batas maksimal
        if (selectedAIs.length < 3) {
            selectedAIs.push(aiKey);
            card.classList.add('selected');
        }
    } else {
        // Jika sudah dipilih, batalkan pilihan
        selectedAIs.splice(index, 1);
        card.classList.remove('selected');
    }
    
    // Perbarui status tombol Compare
    compareBtn.disabled = selectedAIs.length < 2;
    compareBtn.textContent = selectedAIs.length >= 2 
        ? `Compare ${selectedAIs.length} Selected AI` 
        : 'Compare Selected AI';
}

// Fungsi untuk membuat tabel perbandingan
function createComparisonTable() {
    // Kosongkan tabel
    comparisonTable.innerHTML = '';
    
    // Buat header tabel
    const headerRow = document.createElement('tr');
    
    // Kolom fitur
    const featureHeader = document.createElement('th');
    featureHeader.className = 'feature-header';
    featureHeader.textContent = 'Feature';
    headerRow.appendChild(featureHeader);
    
    // Header untuk setiap AI yang dipilih
    selectedAIs.forEach(ai => {
        const aiHeader = document.createElement('th');
        aiHeader.className = 'ai-column';
        
        const headerContent = document.createElement('div');
        headerContent.className = 'ai-header';
        
        // Check if logo is emoji
        const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(aiData[ai].logo);
        const logoClass = isEmoji ? `${aiData[ai].logoClass} emoji-logo` : aiData[ai].logoClass;
        
        const logo = document.createElement('div');
        logo.className = `comparison-ai-logo ${logoClass}`;
        logo.style.background = aiData[ai].gradient;
        logo.textContent = aiData[ai].logo;
        
        const name = document.createElement('div');
        name.className = 'comparison-ai-name';
        name.textContent = aiData[ai].name;
        
        const swapBtn = document.createElement('button');
        swapBtn.className = 'swap-btn';
        swapBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Swap';
        swapBtn.onclick = () => swapAI(ai);
        
        headerContent.appendChild(logo);
        headerContent.appendChild(name);
        headerContent.appendChild(swapBtn);
        aiHeader.appendChild(headerContent);
        
        headerRow.appendChild(aiHeader);
    });
    
    comparisonTable.appendChild(headerRow);
    
    // Baris data untuk setiap fitur
    const features = [
        { name: 'Response Speed', key: 'speed' },
        { name: 'Accuracy', key: 'accuracy' },
        { name: 'Languages Supported', key: 'languages' },
        { name: 'Image Generation', key: 'imageGeneration' },
        { name: 'API Support', key: 'apiSupport' },
        { name: 'Price (Pro)', key: 'price' },
        { name: 'Free Plan', key: 'freePlan' },
        { name: 'Main Strength', key: 'strength' },
        { name: 'Main Weakness', key: 'weakness' },
        { name: 'Try Now', key: 'link' }
    ];
    
    features.forEach(feature => {
        const row = document.createElement('tr');
        
        // Header fitur
        const featureCell = document.createElement('td');
        featureCell.className = 'feature-header';
        featureCell.textContent = feature.name;
        row.appendChild(featureCell);
        
        // Data untuk setiap AI
        selectedAIs.forEach(ai => {
            const dataCell = document.createElement('td');
            dataCell.className = 'ai-column';
            
            if (feature.key === 'accuracy') {
                const ratingDiv = document.createElement('div');
                ratingDiv.className = 'rating';
                
                const stars = document.createElement('span');
                stars.className = 'stars';
                const rating = parseFloat(aiData[ai][feature.key]);
                stars.innerHTML = '⭐'.repeat(Math.floor(rating));
                
                const ratingText = document.createElement('span');
                ratingText.textContent = aiData[ai][feature.key];
                
                ratingDiv.appendChild(stars);
                ratingDiv.appendChild(ratingText);
                dataCell.appendChild(ratingDiv);
            } else if (feature.key === 'link') {
                const linkBtn = document.createElement('a');
                linkBtn.className = 'visit-btn';
                linkBtn.href = aiData[ai][feature.key];
                linkBtn.target = '_blank';
                linkBtn.textContent = `🔗 Visit ${aiData[ai].name}`;
                dataCell.appendChild(linkBtn);
            } else {
                dataCell.innerHTML = aiData[ai][feature.key];
            }
            
            row.appendChild(dataCell);
        });
        
        comparisonTable.appendChild(row);
    });
}

// Fungsi untuk menukar AI
function swapAI(aiToSwap) {
    // Hapus AI yang akan ditukar dari pilihan
    const index = selectedAIs.indexOf(aiToSwap);
    if (index !== -1) {
        selectedAIs.splice(index, 1);
    }
    
    // Reset semua kartu yang dipilih
    document.querySelectorAll('.ai-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Tandai kartu yang masih terpilih
    selectedAIs.forEach(ai => {
        const card = document.querySelector(`.ai-card[data-ai-key="${ai}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
    
    // Perbarui tombol Compare
    compareBtn.disabled = selectedAIs.length < 2;
    compareBtn.textContent = selectedAIs.length >= 2 
        ? `Compare ${selectedAIs.length} Selected AI` 
        : 'Compare Selected AI';
    
    // Tampilkan kembali bagian seleksi
    selectionSection.style.display = 'block';
    comparisonSection.style.display = 'none';
}

// Event listener untuk tombol Compare
compareBtn.addEventListener('click', () => {
    // Buat tabel perbandingan
    createComparisonTable();
    
    // Tampilkan bagian perbandingan dan sembunyikan bagian seleksi
    selectionSection.style.display = 'none';
    comparisonSection.style.display = 'block';
    
    // Scroll ke tabel perbandingan
    comparisonSection.scrollIntoView({ behavior: 'smooth' });
});

// Event listener untuk tombol Change Selection
changeSelectionBtn.addEventListener('click', () => {
    selectionSection.style.display = 'block';
    comparisonSection.style.display = 'none';
    
    // Scroll ke bagian pemilihan
    selectionSection.scrollIntoView({ behavior: 'smooth' });
});

// Search functionality untuk search bar
searchBar.addEventListener('input', filterAICards);

// Search functionality untuk AI populer
popularSearchBar.addEventListener('input', filterPopularAI);

// Chatbot functionality
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Tambahkan pesan pengguna
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);
    
    // Kosongkan input
    userInput.value = '';
    
    // Scroll ke bawah
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulasi respons AI
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        
        // Respons sederhana berdasarkan kata kunci
        if (message.toLowerCase().includes('video') || message.toLowerCase().includes('film')) {
            botMessage.textContent = 'Untuk pembuatan video, saya merekomendasikan Runway ML atau Meta Quest. Ini memiliki alat AI yang kuat untuk editing video, efek visual, dan generasi konten.';
        } else if (message.toLowerCase().includes('gambar') || message.toLowerCase().includes('desain')) {
            botMessage.textContent = 'Untuk pembuatan gambar dan desain, Midjourney dan Stability Matrix adalah pilihan terbaik. Ini menghasilkan seni digital yang menakjubkan dari deskripsi teks.';
        } else if (message.toLowerCase().includes('tulis') || message.toLowerCase().includes('chat')) {
            botMessage.textContent = 'Untuk percakapan dan bantuan menulis, ChatGPT dan Claude AI adalah pilihan yang sangat baik. ChatGPT lebih cepat, sementara Claude memiliki kemampuan reasoning yang kuat.';
        } else if (message.toLowerCase().includes('suara') || message.toLowerCase().includes('audio')) {
            botMessage.textContent = 'Untuk teknologi suara AI, ElevenLabs adalah yang terdepan. Ini menghasilkan ucapan natural dalam 29 bahasa dengan kualitas yang sangat manusiawi.';
        } else if (message.toLowerCase().includes('riset') || message.toLowerCase().includes('penelitian')) {
            botMessage.textContent = 'Untuk penelitian dan pencarian informasi, Perplexity AI dan DeepMind Omega sangat direkomendasikan karena memberikan jawaban dengan kutipan sumber yang akurat.';
        } else if (message.toLowerCase().includes('bisnis') || message.toLowerCase().includes('enterprise')) {
            botMessage.textContent = 'Untuk aplikasi bisnis dan enterprise, Cohere Coral adalah pilihan yang tepat dengan kemampuan reasoning dan RAG yang kuat.';
        } else if (message.toLowerCase().includes('reasoning') || message.toLowerCase().includes('logika')) {
            botMessage.textContent = 'Untuk tugas reasoning kompleks, DeepSeek R1 dan OpenAI O1 adalah pilihan terbaik dengan kemampuan pemecahan masalah yang unggul.';
        } else if (message.toLowerCase().includes('cepat') || message.toLowerCase().includes('speed')) {
            botMessage.textContent = 'Untuk kecepatan tertinggi, coba Gemini Flash 2.0 atau Perplexity Sonic yang dioptimalkan untuk respons ultra cepat. Quantum AI juga sangat cepat untuk perhitungan kompleks.';
        } else if (message.toLowerCase().includes('murah') || message.toLowerCase().includes('harga')) {
            botMessage.textContent = 'Untuk budget terbatas, Mistral Nexus ($8/bulan) dan ElevenLabs ($5/bulan) menawarkan nilai terbaik. DeepSeek R1 juga memiliki free plan yang bagus.';
        } else if (message.toLowerCase().includes('open source') || message.toLowerCase().includes('gratis')) {
            botMessage.textContent = 'Untuk open source, Mistral Nexus adalah pilihan terbaik dengan fitur enterprise dan komunitas yang aktif. Juga tersedia free plan untuk percobaan.';
        } else {
            botMessage.textContent = 'Berdasarkan pertanyaan Anda, saya merekomendasikan untuk mencoba beberapa AI tools populer. ChatGPT bagus untuk percakapan dan menulis, Midjourney untuk gambar, Runway untuk video, dan ElevenLabs untuk suara. Untuk tugas khusus seperti reasoning coba DeepSeek R1 atau OpenAI O1. Mana yang paling sesuai dengan kebutuhan Anda?';
        }
        
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// ==================== DASHBOARD FUNCTIONALITY ====================

// Initialize Dashboard
function initializeDashboard() {
    createDashboardModelCards();
    setupDashboardEventListeners();
}

// Create model cards for dashboard
function createDashboardModelCards() {
    const topModelGrid = document.getElementById('top-model-grid');
    const researchModelGrid = document.getElementById('research-model-grid');
    
    topModelGrid.innerHTML = '';
    researchModelGrid.innerHTML = '';

    // Pisahkan model menjadi Top Models dan Research Models
    const topModels = [];
    const researchModels = [];

    Object.entries(dashboardAIData).forEach(([key, ai]) => {
        // Tentukan apakah ini top model (5 utama)
        const isTopModel = ['chatgpt', 'deepseekr1', 'claude37', 'gemini', 'perplexity'].includes(key);
        
        if (isTopModel) {
            topModels.push({ key, ai });
        } else {
            researchModels.push({ key, ai });
        }
    });

    // Buat kartu untuk Top Models
    topModels.forEach(({ key, ai }) => {
        const card = createModelCard(key, ai, true);
        topModelGrid.appendChild(card);
    });

    // Buat kartu untuk Research Models
    researchModels.forEach(({ key, ai }) => {
        const card = createModelCard(key, ai, false);
        researchModelGrid.appendChild(card);
    });
}

// Helper function untuk membuat kartu model
function createModelCard(key, ai, isTopModel) {
    const card = document.createElement('div');
    card.className = `model-card ${isTopModel ? 'top-model' : 'research-model'}`;
    card.dataset.aiKey = key;
    card.dataset.multimodal = ai.multimodal;
    card.dataset.reasoning = ai.reasoning;
    card.dataset.cost = ai.cost;
    card.dataset.speed = ai.speed;
    
    // Check if logo is emoji
    const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(aiData[key]?.logo || ai.name.charAt(0));
    const iconClass = isEmoji ? 'emoji-icon' : '';
    
    card.innerHTML = `
        <div class="model-icon ${iconClass}" style="background: ${ai.color}">${aiData[key]?.logo || ai.name.charAt(0)}</div>
        <div class="model-info">
            <div class="model-name">${ai.name}</div>
            <div class="model-category">${ai.category}</div>
        </div>
        ${isTopModel ? '<div class="top-badge">★ Top</div>' : ''}
    `;

    card.addEventListener('click', () => toggleDashboardModel(key, card));
    return card;
}

// Toggle Research section
function setupResearchToggle() {
    const researchToggleBtn = document.getElementById('researchToggleBtn');
    const researchFilters = document.getElementById('researchFilters');
    const researchModelGrid = document.getElementById('research-model-grid');

    researchToggleBtn.addEventListener('click', () => {
        const isExpanded = researchModelGrid.style.display === 'flex';
        
        if (isExpanded) {
            researchModelGrid.style.display = 'none';
            researchFilters.style.display = 'none';
            researchToggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show All Models';
            researchToggleBtn.classList.remove('active');
        } else {
            researchModelGrid.style.display = 'flex';
            researchFilters.style.display = 'block';
            researchToggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Models';
            researchToggleBtn.classList.add('active');
            applyResearchFilters(); // Apply current filters when expanding
        }
    });
}

// Setup research filters
function setupResearchFilters() {
    const researchSort = document.getElementById('researchSort');
    const filterOptions = document.querySelectorAll('.filter-option');

    // Sort functionality
    researchSort.addEventListener('change', applyResearchFilters);

    // Filter options
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('active');
            applyResearchFilters();
        });
    });
}

// Apply research filters and sorting
function applyResearchFilters() {
    const researchSort = document.getElementById('researchSort');
    const activeFilters = document.querySelectorAll('.filter-option.active');
    const researchCards = document.querySelectorAll('.research-model-grid .model-card');
    
    const sortBy = researchSort.value;
    const filterTypes = Array.from(activeFilters).map(btn => btn.dataset.filter);

    // Apply filters
    researchCards.forEach(card => {
        let shouldShow = true;

        // Apply each active filter
        filterTypes.forEach(filter => {
            switch (filter) {
                case 'multimodal':
                    if (card.dataset.multimodal !== 'true') shouldShow = false;
                    break;
                case 'free':
                    if (parseInt(card.dataset.cost) > 0) shouldShow = false;
                    break;
                case 'reasoning':
                    if (parseInt(card.dataset.reasoning) < 90) shouldShow = false;
                    break;
            }
        });

        card.style.display = shouldShow ? 'flex' : 'none';
    });

    // Apply sorting
    const visibleCards = Array.from(researchCards).filter(card => card.style.display !== 'none');
    
    visibleCards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.dataset.aiKey.localeCompare(b.dataset.aiKey);
            case 'speed':
                return parseInt(b.dataset.speed) - parseInt(a.dataset.speed);
            case 'cost':
                return parseInt(a.dataset.cost) - parseInt(b.dataset.cost);
            case 'reasoning':
                return parseInt(b.dataset.reasoning) - parseInt(a.dataset.reasoning);
            default:
                return 0;
        }
    });

    // Reorder cards
    const researchModelGrid = document.getElementById('research-model-grid');
    visibleCards.forEach(card => {
        researchModelGrid.appendChild(card);
    });
}

// Toggle model selection in dashboard
function toggleDashboardModel(aiKey, card) {
    const index = selectedDashboardModels.indexOf(aiKey);
    
    if (index === -1) {
        if (selectedDashboardModels.length < 5) {
            selectedDashboardModels.push(aiKey);
            card.classList.add('selected');
        }
    } else {
        selectedDashboardModels.splice(index, 1);
        card.classList.remove('selected');
    }
    
    updateDashboardCompareButton();
}

// Update compare button state
function updateDashboardCompareButton() {
    const compareBtn = document.getElementById('generate-comparison');
    compareBtn.disabled = selectedDashboardModels.length < 2;
    
    if (selectedDashboardModels.length >= 2) {
        compareBtn.innerHTML = `<i class="fas fa-chart-bar"></i> Compare ${selectedDashboardModels.length} Models`;
    } else {
        compareBtn.innerHTML = `<i class="fas fa-chart-bar"></i> Generate Comparison Charts`;
    }
}

// Setup dashboard event listeners
function setupDashboardEventListeners() {
    // Select all models
    document.getElementById('select-all-models').addEventListener('click', () => {
        selectedDashboardModels = Object.keys(dashboardAIData);
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.add('selected');
        });
        updateDashboardCompareButton();
    });

    // Clear selection
    document.getElementById('clear-selection').addEventListener('click', () => {
        selectedDashboardModels = [];
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        updateDashboardCompareButton();
    });

    // Generate comparison
    document.getElementById('generate-comparison').addEventListener('click', generateComparisonCharts);

    // Chart filter buttons
    document.querySelectorAll('.chart-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const metric = e.currentTarget.dataset.metric;
            switchChart(metric);
        });
    });

    // Search functionality
    document.getElementById('dashboard-search').addEventListener('input', filterDashboardModels);

    // Research functionality
    setupResearchToggle();
    setupResearchFilters();
}

// Filter models in dashboard
function filterDashboardModels() {
    const searchTerm = document.getElementById('dashboard-search').value.toLowerCase();
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        const aiKey = card.dataset.aiKey;
        const ai = dashboardAIData[aiKey];
        const matchesSearch = ai.name.toLowerCase().includes(searchTerm) || 
                            ai.category.toLowerCase().includes(searchTerm);
        
        if (matchesSearch || searchTerm === '') {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Switch between chart metrics
function switchChart(metric) {
    currentChartMetric = metric;
    
    // Update active button
    document.querySelectorAll('.chart-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.chart-filter-btn[data-metric="${metric}"]`).classList.add('active');
    
    // Update active chart
    document.querySelectorAll('.chart-card').forEach(card => {
        card.classList.remove('active');
    });
    document.getElementById(`${metric}-chart`).classList.add('active');
    
    // Regenerate charts if models are selected
    if (selectedDashboardModels.length >= 2) {
        generateComparisonCharts();
    }
}

// Generate comparison charts
function generateComparisonCharts() {
    const filteredModels = selectedDashboardModels.map(key => dashboardAIData[key]);
    
    // Update all charts
    updateChart('intelligence-bars', filteredModels, 'intelligence', '%');
    updateChart('speed-bars', filteredModels, 'speed', '%');
    updateChart('cost-bars', filteredModels, 'cost', '$');
    updateChart('reasoning-bars', filteredModels, 'reasoning', '%');
    
    // Update insight
    updateDashboardInsight(filteredModels);
    
    // Scroll to charts
    document.getElementById('charts-panel').scrollIntoView({ behavior: 'smooth' });
}

// Update individual chart
function updateChart(containerId, models, metric, unit) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    // Find best value for highlighting
    let bestValue;
    if (metric === 'cost') {
        bestValue = Math.min(...models.map(model => model[metric]));
    } else {
        bestValue = Math.max(...models.map(model => model[metric]));
    }
    
    models.forEach(model => {
        const value = model[metric];
        const height = metric === 'cost' ? 
            Math.max(20, 100 - value * 3) : // Invert for cost
            Math.max(20, value);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const bar = document.createElement('div');
        bar.className = `bar ${metric}`;
        bar.style.height = `${height}%`;
        bar.style.background = model.color;
        
        if (value === bestValue) {
            bar.classList.add('highlight');
        }
        
        const valueLabel = document.createElement('div');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = metric === 'cost' ? `${unit}${value}` : `${value}${unit}`;
        
        const nameLabel = document.createElement('div');
        nameLabel.className = 'bar-label';
        nameLabel.textContent = model.name;
        
        bar.appendChild(valueLabel);
        barContainer.appendChild(bar);
        barContainer.appendChild(nameLabel);
        container.appendChild(barContainer);
    });
}

// Update dashboard insight
function updateDashboardInsight(models) {
    const insightElement = document.getElementById('insight-content');
    
    if (models.length === 0) {
        insightElement.textContent = 'Select models and generate comparison to see insights';
        return;
    }
    
    // Find best in each category
    const bestIntelligence = models.reduce((best, current) => 
        current.intelligence > best.intelligence ? current : best
    );
    
    const bestSpeed = models.reduce((best, current) => 
        current.speed > best.speed ? current : best
    );
    
    const bestCost = models.reduce((best, current) => 
        current.cost < best.cost ? current : best
    );
    
    const bestReasoning = models.reduce((best, current) => 
        current.reasoning > best.reasoning ? current : best
    );
    
    let insightText = '';
    
    if (models.length === 1) {
        const model = models[0];
        insightText = `${model.name} scores ${model.intelligence}% in intelligence, ${model.speed}% in speed, ${model.reasoning}% in reasoning, and costs $${model.cost} per million tokens.`;
    } else {
        insightText = `Among selected models: ${bestIntelligence.name} leads in intelligence (${bestIntelligence.intelligence}%), ${bestSpeed.name} is fastest (${bestSpeed.speed}%), ${bestReasoning.name} excels in reasoning (${bestReasoning.reasoning}%), while ${bestCost.name} offers the best value at $${bestCost.cost}.`;
        
        // Add specific recommendations
        if (bestIntelligence.intelligence - models[0].intelligence > 10) {
            insightText += ` For complex tasks, ${bestIntelligence.name} is clearly superior.`;
        }
        
        if (bestCost.cost < 10) {
            insightText += ` ${bestCost.name} provides excellent cost-effectiveness.`;
        }
        
        if (bestReasoning.reasoning > 95) {
            insightText += ` ${bestReasoning.name} is exceptional for logical reasoning tasks.`;
        }
        
        // Special insights for new AI models
        if (models.some(m => m.name.includes('Quantum'))) {
            insightText += ` Quantum AI shows exceptional performance in computational tasks.`;
        }
        if (models.some(m => m.name.includes('Neural Link'))) {
            insightText += ` Neural Link demonstrates advanced pattern recognition capabilities.`;
        }
    }
    
    insightElement.textContent = insightText;
}

// ==================== INITIALIZATION ====================

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    createFilterTags();
    createPopularAICards();
    createAICards();
    initializeDashboard();
});

// Smooth scrolling untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Tutup mobile menu jika terbuka
            navMenu.classList.remove('show');
        }
    });
});

// Simple particle effect for hero section
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            100% { transform: translateY(${Math.random() * 100 - 50}vh) translateX(${Math.random() * 100 - 50}vw); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize particles
createParticles();