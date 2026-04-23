const quotesData = [
  { text: "Don't go through life, grow through life.", author: "Eric Butterworth", category: "wisdom" },
  { text: "The energy you give is the energy you get back.", author: "Manifesto", category: "chill" },
  { text: "Hustle until your haters ask if you're hiring.", author: "Hustle Prophet", category: "hustle" },
  { text: "Life is short. Make every hair flip count.", author: "Glow Up", category: "wild" },
  { text: "Normal is boring. Stay weird, stay wired.", author: "Chaos Lord", category: "wild" },
  { text: "Don't stop until you're proud of the vision.", author: "Visionary", category: "hustle" },
  { text: "Vibe high and the magic will find you.", author: "Zen Mode", category: "chill" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "wisdom" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill", category: "hustle" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso", category: "wild" },
  { text: "Peace is not the absence of chaos, but the mastery of it.", author: "The Master", category: "chill" }
];

function readFavorites() {
  try {
    const raw = localStorage.getItem("faves");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const app = {
  currentTab: "generator",
  currentCategory: "wild",
  favorites: readFavorites(),
  currentQuote: null,

  init() {
    this.currentQuote = quotesData.find((q) => q.category === this.currentCategory) || quotesData[0];
    this.updateView();
    this.switchTab("generator");
    this.renderSaved();
    this.renderFeed();
    this.updateFavIcon();
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll(".tab-content").forEach((el) => el.classList.add("hidden"));

    const tab = document.getElementById(`tab-${tabId}`);
    if (tab) {
      tab.classList.remove("hidden");
    }

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active-tab", btn.dataset.tab === tabId);
    });

    if (tabId === "saved") this.renderSaved();
    if (tabId === "feed") this.renderFeed();
    if (tabId === "share") this.updateSharePreview();

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  setCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.style.transform = btn.dataset.cat === cat ? "scale(1.1) translateY(-5px)" : "scale(1)";
      btn.style.zIndex = btn.dataset.cat === cat ? "10" : "1";
    });
    this.nextQuote();
  },

  nextQuote() {
    const card = document.getElementById("quote-card");
    if (!card) return;

    card.classList.add("is-flipped");

    setTimeout(() => {
      const filtered = quotesData.filter((q) => q.category === this.currentCategory);
      this.currentQuote = filtered[Math.floor(Math.random() * filtered.length)] || quotesData[0];

      const quoteDisplay = document.getElementById("quote-display");
      const authorDisplay = document.getElementById("author-display");
      if (quoteDisplay) quoteDisplay.innerText = `"${this.currentQuote.text}"`;
      if (authorDisplay) authorDisplay.innerText = this.currentQuote.author;

      this.updateFavIcon();

      setTimeout(() => {
        card.classList.remove("is-flipped");
      }, 400);
    }, 600);
  },

  toggleFavorite() {
    if (!this.currentQuote) return;

    const index = this.favorites.findIndex((q) => q.text === this.currentQuote.text);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(this.currentQuote);
    }

    localStorage.setItem("faves", JSON.stringify(this.favorites));
    this.updateFavIcon();
    this.renderSaved();

    const statFaves = document.getElementById("stat-faves");
    if (statFaves) statFaves.innerText = String(this.favorites.length);
  },

  updateFavIcon() {
    const icon = document.getElementById("fav-icon");
    const btn = document.getElementById("fav-btn");
    if (!icon || !btn || !this.currentQuote) return;

    const isFave = this.favorites.some((q) => q.text === this.currentQuote.text);

    icon.setAttribute("icon", isFave ? "iconamoon:heart-fill" : "lucide:heart");
    btn.style.color = isFave ? "#ff00e5" : "black";
  },

  renderSaved() {
    const grid = document.getElementById("saved-grid");
    const empty = document.getElementById("saved-empty");
    if (!grid || !empty) return;

    grid.innerHTML = "";

    if (this.favorites.length === 0) {
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");

    this.favorites.forEach((q, i) => {
      const card = document.createElement("div");
      card.className = `bg-white text-black p-10 rounded-[3rem] border-8 border-black relative flex flex-col justify-between h-[400px] transition-transform hover:translate-y-[-10px] shadow-[15px_15px_0px_#${i % 2 ? "00f5ff" : "ff00e5"}]`;
      card.innerHTML = `
        <div class="space-y-6">
          <iconify-icon icon="fa6-solid:quote-left" class="text-5xl text-gray-100"></iconify-icon>
          <p class="font-display text-2xl font-black leading-none tracking-tighter uppercase italic">"${q.text}"</p>
        </div>
        <div class="pt-8 border-t-4 border-black/5 flex justify-between items-end">
          <div>
            <span class="block font-display text-xl font-black uppercase italic text-[#ff00e5]">${q.author}</span>
            <span class="block text-[10px] font-bold uppercase text-gray-400 tracking-widest">Stored in Archive</span>
          </div>
          <button onclick="app.removeFave(${i})" class="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors"><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  removeFave(index) {
    this.favorites.splice(index, 1);
    localStorage.setItem("faves", JSON.stringify(this.favorites));
    this.renderSaved();

    const statFaves = document.getElementById("stat-faves");
    if (statFaves) statFaves.innerText = String(this.favorites.length);
  },

  renderFeed() {
    const feed = document.getElementById("feed-list");
    if (!feed) return;

    feed.innerHTML = "";

    quotesData.slice(0, 5).forEach((q, i) => {
      const item = document.createElement("div");
      item.className = "flex flex-col md:flex-row gap-12 items-center";
      item.innerHTML = `
        <div class="w-full bg-white text-black p-12 rounded-[4rem] border-8 border-black shadow-[20px_20px_0px_${i % 2 ? "#00f5ff" : "#ccff00"}] relative flex-1">
          <p class="font-display text-4xl md:text-5xl font-black leading-none uppercase italic">"${q.text}"</p>
          <div class="mt-8 flex items-center gap-4">
            <div class="h-1.5 w-16 bg-[#ff00e5]"></div>
            <span class="font-display text-2xl font-black uppercase italic">${q.author}</span>
          </div>
        </div>
        <div class="flex md:flex-col gap-6">
          <div class="flex flex-col items-center"><button class="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center hover:bg-[#ff00e5] hover:text-white transition-all"><iconify-icon icon="lucide:heart" class="text-2xl"></iconify-icon></button><span class="text-xs font-black mt-1 italic">12.4k</span></div>
          <div class="flex flex-col items-center"><button class="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center hover:bg-[#00f5ff] transition-all"><iconify-icon icon="lucide:share-2" class="text-2xl"></iconify-icon></button><span class="text-xs font-black mt-1 italic">2.1k</span></div>
        </div>
      `;
      feed.appendChild(item);
    });
  },

  updateSharePreview() {
    if (!this.currentQuote) return;

    const sharePreviewText = document.getElementById("share-preview-text");
    const sharePreviewAuthor = document.getElementById("share-preview-author");
    if (sharePreviewText) sharePreviewText.innerText = `"${this.currentQuote.text}"`;
    if (sharePreviewAuthor) sharePreviewAuthor.innerText = this.currentQuote.author;
  },

  socialShare(platform) {
    if (!this.currentQuote) return;

    const msg = document.getElementById("share-msg-input")?.value ?? "";
    const text = `${msg ? `${msg} ` : ""}"${this.currentQuote.text}" - ${this.currentQuote.author}`;
    const url = window.location.href;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`
    };

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  },

  async copyLink() {
    const btn = document.getElementById("copy-btn-text");
    if (!btn) return;

    const original = btn.innerText;

    try {
      await navigator.clipboard.writeText(window.location.href);
      btn.innerText = "CLIPBOARD OVERLOADED!";
    } catch {
      btn.innerText = "COPY FAILED";
    }

    setTimeout(() => {
      btn.innerText = original;
    }, 2000);
  },

  exportQuotes() {
    const text = this.favorites.map((q) => `"${q.text}" - ${q.author}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "CHAOS_ARCHIVE.txt";
    a.click();

    URL.revokeObjectURL(url);
  },

  updateView() {
    const statFaves = document.getElementById("stat-faves");
    if (statFaves) statFaves.innerText = String(this.favorites.length);
  }
};

window.app = app;
app.init();
