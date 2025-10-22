// -----------------------------
// Crypto Hub - main.js
// -----------------------------

// -----------------------------
// Crypto Hub - Multi-chain Tokens
// -----------------------------

let currentChain = "ethereum-ecosystem";

// -----------------------------
// Minimal Skeleton Loader (No Animation)
// -----------------------------
function showSkeletonLoader(containerId, count = 10) {
  const container = document.getElementById(containerId);
  container.innerHTML = Array(count).fill('').map(() => `
    <div class="bg-gray-800 p-4 rounded-xl shadow">
      <div class="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full"></div>
      <div class="h-3 bg-gray-700 w-3/4 mx-auto mb-2 rounded"></div>
      <div class="h-3 bg-gray-700 w-1/2 mx-auto rounded"></div>
    </div>
  `).join('');
}


async function loadTopTokens(chain = "ethereum-ecosystem") {
  const tokenGrid = document.getElementById('tokenGrid');
showSkeletonLoader('tokenGrid', 10);

  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${chain}&order=market_cap_desc&per_page=10&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.length) {
      tokenGrid.innerHTML = `<p class="text-yellow-400">⚠️ No data for ${chain}. Showing global top 10.</p>`;
      return loadTopTokensGlobal();
    }

    tokenGrid.innerHTML = data.map(token => `
      <div class="bg-gray-800 rounded-xl p-4 shadow text-center hover:shadow-lg transition">
        <img src="${token.image}" alt="${token.name}" class="w-10 h-10 mx-auto mb-2">
        <p class="font-semibold">${token.name}</p>
        <p class="text-sm text-gray-400">${token.symbol.toUpperCase()}</p>
        <p class="mt-1">$${token.current_price.toLocaleString()}</p>
        <p class="${token.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} text-sm">
          ${token.price_change_percentage_24h?.toFixed(2) ?? 0}%
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error(error);
    tokenGrid.innerHTML = `<p class="text-red-400">⚠️ Failed to load ${chain} data.</p>`;
  }
}

async function loadTopTokensGlobal() {
  const tokenGrid = document.getElementById('tokenGrid');
showSkeletonLoader('tokenGrid', 10);

  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
    const res = await fetch(url);
    const data = await res.json();

    tokenGrid.innerHTML = data.map(token => `
      <div class="bg-gray-800 rounded-xl p-4 shadow text-center hover:shadow-lg transition">
        <img src="${token.image}" alt="${token.name}" class="w-10 h-10 mx-auto mb-2">
        <p class="font-semibold">${token.name}</p>
        <p class="text-sm text-gray-400">${token.symbol.toUpperCase()}</p>
        <p class="mt-1">$${token.current_price.toLocaleString()}</p>
        <p class="${token.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} text-sm">
          ${token.price_change_percentage_24h?.toFixed(2) ?? 0}%
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error(error);
    tokenGrid.innerHTML = `<p class="text-red-400">⚠️ Failed to load token data.</p>`;
  }
}


// 🧭 Handle tab clicks
function setupChainTabs() {
  const tabs = document.querySelectorAll('.chain-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Reset styles
      tabs.forEach(t => t.classList.remove('bg-yellow-500', 'text-black'));
      tabs.forEach(t => t.classList.add('bg-gray-700', 'text-white'));

      // Highlight active
      tab.classList.remove('bg-gray-700', 'text-white');
      tab.classList.add('bg-yellow-500', 'text-black');

      currentChain = tab.dataset.chain;
      loadTopTokens(currentChain);
    });
  });
}

// 📰 2. Fetch Crypto News from RSS2JSON (Cointelegraph)
async function loadNews() {
  const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss';
  const newsFeed = document.getElementById('newsFeed');

  try {
    newsFeed.innerHTML = `<p class="text-gray-400">Fetching latest news...</p>`;
    const res = await fetch(feedUrl);
    const data = await res.json();

    newsFeed.innerHTML = data.items.slice(0, 6).map(item => `
      <article class="bg-white text-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2 text-lg">
          <a href="${item.link}" target="_blank" class="hover:text-blue-500">${item.title}</a>
        </h3>
        <p class="text-sm text-gray-600 mb-2">${item.pubDate.split(' ')[0]}</p>
        <p class="text-sm">${item.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0,120)}...</p>
      </article>
    `).join('');
  } catch (error) {
    newsFeed.innerHTML = `<p class="text-red-400">⚠️ Failed to fetch news.</p>`;
    console.error("News fetch error:", error);
  }
}

// 🎓 3. Load Crypto Basics (Static for now)
function loadLearnSection() {
  const learnSection = document.getElementById('learnSection');
  const basics = [
    { title: "What is Blockchain?", desc: "A shared ledger technology that securely records transactions across a network." },
    { title: "What is a Wallet?", desc: "A wallet stores your crypto assets and allows transactions through your private keys." },
    { title: "What is DeFi?", desc: "Decentralized finance enables peer-to-peer financial activities without banks." },
    { title: "What is an Exchange?", desc: "Platforms where users can trade cryptocurrencies for others or fiat money." },
    { title: "How to Stay Safe?", desc: "Use official apps, verify links, and never share your seed phrase." },
    { title: "Learn & Explore", desc: "Explore crypto responsibly—start small, learn daily, and understand risks." }
  ];

  learnSection.innerHTML = basics.map(b => `
    <div class="bg-white text-gray-900 p-4 rounded-xl shadow">
      <h3 class="font-semibold mb-2">${b.title}</h3>
      <p class="text-sm text-gray-700">${b.desc}</p>
    </div>
  `).join('');
}

// 💰 4. Donation Button Logic (MetaMask)
async function handleDonation() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask to donate!");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: "0x5a804eFFfd535894925a351982B1717cDa297e90", // ⚠️ Replace with your wallet
      value: ethers.utils.parseEther("0.001")
    });

    alert(`🙏 Thank you! Tx hash: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    alert("Transaction cancelled or failed.");
  }
}

// 💬 5. Occasional Donation Prompt
function startDonationPrompt() {
  setInterval(() => {
    if (Math.random() < 0.2) { // 20% chance every 5 min
      alert("💰 Support this free crypto hub with a small MetaMask donation!");
    }
  }, 300000); // 5 minutes
}

// -----------------------------
// Scroll Spy & Sticky Navbar Highlight
// -----------------------------
function setupScrollSpy() {
  const sections = document.querySelectorAll("main section");
  const navLinks = document.querySelectorAll(".nav-link");

  function activateLink() {
    let index = sections.length;

    while (--index && window.scrollY + 120 < sections[index].offsetTop) {}
    navLinks.forEach(link => link.classList.remove("text-yellow-400", "font-semibold"));
    navLinks[index].classList.add("text-yellow-400", "font-semibold");
  }

  activateLink(); // initialize
  window.addEventListener("scroll", activateLink);
}


// 🚀 Initialize App
window.onload = function() {
      setupScrollSpy();        // 👈 highlight nav while scrolling

    setupChainTabs();

  loadTopTokens();
  loadNews();
  loadLearnSection();
  startDonationPrompt();

  document.getElementById('donateBtn').addEventListener('click', handleDonation);
};
