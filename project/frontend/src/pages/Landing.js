import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── LOGO ── */
function LuxewearLogo({ white = false }) {
  return (
    <svg viewBox="0 0 320 100" width="200" height="62" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={white ? '#fff' : '#ff6b00'} />
          <stop offset="100%" stopColor={white ? 'rgba(255,255,255,0.7)' : '#ff9a5a'} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="30" stroke="url(#luxGrad)" strokeWidth="2" fill="none" />
      <text x="35" y="58" fontSize="20" fontFamily="'Cormorant Garamond', Georgia, serif"
        fill="url(#luxGrad)" fontWeight="bold">LW</text>
      <text x="100" y="52" fontSize="28" fontFamily="'Cormorant Garamond', Georgia, serif"
        fill={white ? '#fff' : '#1a1a1a'} fontWeight="700" letterSpacing="3">LUXEWEAR</text>
      <text x="100" y="72" fontSize="10" fontFamily="'Jost', Arial, sans-serif"
        fill={white ? 'rgba(255,255,255,0.7)' : '#888'} letterSpacing="4">FASHION • STYLE</text>
    </svg>
  );
}

/* ── DATA ── */
const SLIDES = [
  {
    heading: 'Dress to', highlight: 'Impress', sub: 'Every Single Day',
    desc: 'Premium fashion for every occasion — from office formals to weekend casuals.',
    cta: 'Shop Now',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1100&fit=crop&q=90',
  },
  {
    heading: 'New', highlight: 'Collection', sub: 'Just Dropped',
    desc: "Discover 2000+ fresh styles added daily. Be the first to wear what's trending.",
    cta: 'Explore Now',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1100&fit=crop&q=90',
  },
  {
    heading: 'Sale Up', highlight: 'To 50% Off', sub: 'Limited Time Only',
    desc: 'Members get early access. Register free and unlock exclusive deals.',
    cta: 'Get Offer',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1100&fit=crop&q=90',
  },
];

const CATEGORIES = [
  { name: 'Women',       emoji: '👗', count: '200+ Styles' },
  { name: 'Men',         emoji: '👔', count: '120+ Styles' },
  { name: 'Footwear',    emoji: '👟', count: '80+ Styles'  },
  { name: 'Accessories', emoji: '👜', count: '150+ Styles' },
  { name: 'Cosmetics',   emoji: '💄', count: '100+ Styles' },
];

const PRODUCTS = [
  { name: 'Floral Maxi Dress',      price: '₹1,299', orig: '₹1,799', tag: 'TRENDING', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=260&fit=crop' },
  { name: 'White Leather Sneakers', price: '₹2,499', orig: '₹2,999', tag: 'NEW',      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=260&fit=crop' },
  { name: 'Structured Tote Bag',    price: '₹3,299', orig: '₹4,500', tag: 'HOT',      img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=260&fit=crop' },
  { name: 'Slim Fit Dark Jeans',    price: '₹1,599', orig: '₹1,999', tag: 'SALE',     img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=260&fit=crop' },
];

const OFFERS = [
  'FREE SHIPPING ABOVE ₹999','✦','NEW ARRIVALS DAILY','✦',
  'EXCLUSIVE MEMBER DEALS','✦','EASY 30-DAY RETURNS','✦',
  '100% AUTHENTIC PRODUCTS','✦','UP TO 50% OFF TODAY','✦',
];

const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i, size: 4 + i * 0.8,
  left: 240 + i * 80, bottom: 50 + (i % 3) * 22,
  delay: i * 0.9, duration: 5.5 + i * 0.4,
}));

export default function Landing() {
  const navigate = useNavigate();
  const [slide, setSlide]         = useState(0);
  const [activeCat, setActiveCat] = useState(0);
  const [imgKey, setImgKey]       = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
      setImgKey(k => k + 1);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    setSlide(idx);
    setImgKey(k => k + 1);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
      setImgKey(k => k + 1);
    }, 5000);
  };

  const handleCatClick = (catName) => navigate(`/home?category=${catName}`);
  const handleShopNow  = () => navigate('/register');
  const handleSignIn   = () => navigate('/login');
  const handleProduct  = () => navigate('/login');

  const s = SLIDES[slide];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

        :root {
          --or:  #ff6b00;
          --or2: #ff8c42;
          --bg:  #ffffff;
          --bg2: #faf9f7;
          --bg3: #f4f2ef;
          --txt: #1a1a1a;
          --t2:  #555555;
          --t3:  #888888;
          --bd:  rgba(0,0,0,0.09);
          --bds: rgba(0,0,0,0.05);
        }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body {
          width:100%; height:100%; overflow:hidden;
          font-family:'Jost',sans-serif;
          background:#fff; color:var(--txt);
        }

        /* ── SHELL ── */
        .lw-shell {
          width:100vw; height:100vh; overflow:hidden; position:relative;
          background:#fff;
          display:grid;
          grid-template-rows: 68px 1fr 40px;
          grid-template-columns: 230px 1fr 310px;
          grid-template-areas:
            "nav   nav   nav"
            "left  mid   right"
            "bar   bar   bar";
        }
        .lw-shell::before {
          content:''; position:absolute; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,107,0,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,.04) 1px, transparent 1px);
          background-size:50px 50px;
          animation:gridDrift 35s linear infinite;
        }
        @keyframes gridDrift { 0%{transform:translate(0,0)} 100%{transform:translate(50px,50px)} }

        /* Orbs */
        .lw-orb { position:absolute; border-radius:50%; filter:blur(100px); pointer-events:none; z-index:0; animation:orbPulse 9s ease-in-out infinite; }
        .lw-orb-a { width:380px;height:380px;background:rgba(255,107,0,.07);top:-60px;left:28%; }
        .lw-orb-b { width:240px;height:240px;background:rgba(255,140,66,.05);bottom:30px;left:8%;animation-delay:3s; }
        .lw-orb-c { width:180px;height:180px;background:rgba(255,107,0,.05);top:35%;right:8%;animation-delay:1.5s; }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07) translate(10px,-12px);opacity:.7} }

        /* Particles */
        .lw-particle {
          position:absolute; border-radius:50%; background:var(--or);
          pointer-events:none; z-index:1; opacity:0;
          animation:particleFly var(--dur) ease-in-out infinite;
          animation-delay:var(--delay);
        }
        @keyframes particleFly {
          0%{opacity:0;transform:translateY(0) scale(0)}
          20%{opacity:.3;transform:translateY(-22px) scale(1)}
          80%{opacity:.1;transform:translateY(-90px) scale(.5)}
          100%{opacity:0;transform:translateY(-130px) scale(0)}
        }

        /* ── NAVBAR ── */
        .lw-nav {
          grid-area:nav; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 1.8rem;
          background:rgba(255,255,255,.96); backdrop-filter:blur(20px);
          border-bottom:1px solid var(--bd);
          animation:fadeDown .6s ease both;
        }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        .lw-logo-wrap { display:flex; align-items:center; cursor:pointer; transition:transform .25s; }
        .lw-logo-wrap:hover { transform:translateY(-1px); }
        .lw-nav-links { display:flex; gap:2.2rem; list-style:none; }
        .lw-nav-links a { color:var(--t3); text-decoration:none; font-size:.72rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; transition:color .2s; position:relative; cursor:pointer; }
        .lw-nav-links a::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:1.5px; background:var(--or); transform:scaleX(0); transform-origin:left; transition:transform .25s; }
        .lw-nav-links a:hover { color:var(--txt); }
        .lw-nav-links a:hover::after { transform:scaleX(1); }
        .lw-nav-actions { display:flex; gap:.65rem; }
        .lw-btn-ghost { background:transparent; color:var(--t2); border:1.5px solid var(--bd); padding:7px 20px; border-radius:4px; font-family:'Jost',sans-serif; font-size:.72rem; font-weight:600; letter-spacing:1px; cursor:pointer; transition:all .22s; }
        .lw-btn-ghost:hover { border-color:var(--or); color:var(--or); }
        .lw-btn-nav-cta { background:var(--or); color:#fff; border:none; padding:8px 22px; border-radius:4px; font-family:'Jost',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:1px; cursor:pointer; transition:all .22s; position:relative; overflow:hidden; }
        .lw-btn-nav-cta::after { content:''; position:absolute; top:0; left:-80px; width:50px; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent); animation:shine 2.8s ease-in-out infinite; }
        @keyframes shine { 0%{left:-80px} 55%,100%{left:160px} }
        .lw-btn-nav-cta:hover { background:var(--or2); transform:translateY(-1px); box-shadow:0 5px 16px rgba(255,107,0,.3); }

        /* ── LEFT PANEL ── */
        .lw-left {
          grid-area:left; z-index:10;
          border-right:1px solid var(--bd); background:var(--bg2);
          display:flex; flex-direction:column; padding:1.8rem 0;
          animation:fadeLeft .7s ease .15s both;
        }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        .lw-panel-label { font-size:.58rem; letter-spacing:3px; color:var(--t3); text-transform:uppercase; font-weight:700; padding:0 1.5rem; margin-bottom:1.1rem; }
        .lw-cat-list { display:flex; flex-direction:column; gap:1px; flex:1; }
        .lw-cat-item { display:flex; align-items:center; gap:.9rem; padding:.8rem 1.5rem; cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
        .lw-cat-item::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--or); transform:scaleY(0); transform-origin:bottom; transition:transform .25s; }
        .lw-cat-item:hover { background:rgba(255,107,0,.05); }
        .lw-cat-item:hover::before,.lw-cat-item.active::before { transform:scaleY(1); }
        .lw-cat-item.active { background:rgba(255,107,0,.07); }
        .lw-cat-icon { font-size:1.25rem; flex-shrink:0; transition:transform .2s; }
        .lw-cat-item:hover .lw-cat-icon { transform:scale(1.18); }
        .lw-cat-name { font-size:.82rem; font-weight:600; color:var(--txt); }
        .lw-cat-count { font-size:.6rem; color:var(--or); font-weight:600; letter-spacing:.8px; margin-top:1px; }
        .lw-cat-arrow { font-size:.65rem; color:var(--t3); margin-left:auto; transition:color .2s,transform .2s; }
        .lw-cat-item:hover .lw-cat-arrow,.lw-cat-item.active .lw-cat-arrow { color:var(--or); transform:translateX(2px); }
        .lw-divider { height:1px; background:var(--bd); margin:1rem 1.5rem; }
        .lw-stat-grid { padding:0 1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:.7rem; }
        .lw-stat-box { background:var(--bg); border:1.5px solid var(--bds); border-radius:6px; padding:.7rem .8rem; box-shadow:0 1px 4px rgba(0,0,0,.04); }
        .lw-stat-val { font-family:'Cormorant Garamond',serif; font-size:1.35rem; font-weight:700; color:var(--or); line-height:1; }
        .lw-stat-lbl { font-size:.56rem; color:var(--t3); letter-spacing:1px; text-transform:uppercase; margin-top:2px; }

        /* ── CENTER PANEL ── */
        .lw-mid {
          grid-area:mid; z-index:10;
          display:flex; flex-direction:column; justify-content:center; align-items:flex-start;
          padding:2rem 3rem; position:relative; overflow:hidden;
          animation:fadeUp .8s ease .1s both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

        /* ── HERO IMAGE — FULL CLEAR, NO HEAVY FADE ── */
        .lw-hero-img {
          position:absolute;
          right:0; top:0; bottom:0;
          width:55%;           /* wider to show more image */
          z-index:0;
          pointer-events:none;
          overflow:hidden;
        }
        .lw-hero-img img {
          width:100%; height:100%;
          object-fit:cover;
          object-position:center top;
          display:block;
          transition:opacity .6s ease, transform .6s ease;
        }
        /* Light fade only on LEFT edge so text stays readable */
        .lw-hero-img::before {
          content:'';
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(
            to right,
            #ffffff 0%,
            rgba(255,255,255,0.55) 30%,
            rgba(255,255,255,0.1) 60%,
            transparent 100%
          );
        }
        /* Subtle vignette on top+bottom */
        .lw-hero-img::after {
          content:'';
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(
            to bottom,
            rgba(255,255,255,0.12) 0%,
            transparent 20%,
            transparent 80%,
            rgba(255,255,255,0.15) 100%
          );
        }

        /* Slide-in animation on image change */
        .lw-img-animate {
          animation: imgSlide .55s ease both;
        }
        @keyframes imgSlide {
          from { opacity:0; transform:scale(1.04); }
          to   { opacity:1; transform:scale(1); }
        }

        .lw-mid-content { position:relative; z-index:2; }
        .lw-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:.65rem; letter-spacing:3.5px; font-weight:700; color:var(--or); text-transform:uppercase; margin-bottom:1.1rem; }
        .lw-eyebrow-line { width:26px; height:1.5px; background:var(--or); }
        .lw-headline { font-family:'Cormorant Garamond',serif; font-size:clamp(3rem,5.2vw,5.5rem); font-weight:700; line-height:.95; color:var(--txt); margin-bottom:.3rem; }
        .lw-headline em { font-style:italic; display:block; background:linear-gradient(135deg,var(--or),var(--or2),#f5a623); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .lw-subhead { font-size:.75rem; letter-spacing:4px; color:var(--t3); text-transform:uppercase; font-weight:300; margin-bottom:1.3rem; }
        .lw-desc { font-size:.9rem; color:var(--t2); line-height:1.85; max-width:360px; margin-bottom:2rem; }
        .lw-cta-row { display:flex; gap:.9rem; }
        .lw-btn-main { background:linear-gradient(135deg,var(--or),var(--or2)); color:#fff; border:none; padding:13px 36px; border-radius:4px; font-family:'Jost',sans-serif; font-size:.82rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all .28s; box-shadow:0 8px 26px rgba(255,107,0,.28); position:relative; overflow:hidden; }
        .lw-btn-main::before { content:''; position:absolute; top:0; left:-100%; width:55px; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent); animation:btnShine 2.6s ease-in-out infinite; }
        @keyframes btnShine { 0%{left:-100%} 60%,100%{left:160%} }
        .lw-btn-main:hover { transform:translateY(-3px); box-shadow:0 14px 36px rgba(255,107,0,.38); }
        .lw-btn-outline { background:transparent; color:var(--t2); border:1.5px solid var(--bd); padding:12px 28px; border-radius:4px; font-family:'Jost',sans-serif; font-size:.82rem; font-weight:500; cursor:pointer; transition:all .25s; }
        .lw-btn-outline:hover { border-color:var(--or); color:var(--or); transform:translateY(-2px); }

        .lw-dots { position:absolute; right:1.5rem; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:6px; z-index:20; }
        .lw-dot { width:5px; height:5px; border-radius:50%; background:rgba(0,0,0,.18); cursor:pointer; transition:all .3s; }
        .lw-dot.active { background:var(--or); height:20px; border-radius:3px; }

        .lw-badge { position:absolute; bottom:2rem; left:3rem; z-index:10; background:#fff; box-shadow:0 4px 20px rgba(0,0,0,.1); border:1.5px solid rgba(255,107,0,.25); border-radius:6px; padding:10px 16px; animation:badgePop .6s ease .9s both,badgePulse 3s ease-in-out 1.5s infinite; }
        @keyframes badgePop { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes badgePulse { 0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.1)} 50%{box-shadow:0 6px 24px rgba(255,107,0,.22)} }
        .lw-badge-fire { font-size:.6rem; letter-spacing:2px; color:var(--or); text-transform:uppercase; font-weight:700; }
        .lw-badge-text { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:var(--txt); line-height:1.15; }

        /* Slide content animation */
        .lw-slide-in { animation:slideIn .45s ease both; }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* ── RIGHT PANEL ── */
        .lw-right {
          grid-area:right; z-index:10;
          border-left:1px solid var(--bd); background:var(--bg2);
          display:flex; flex-direction:column; padding:1.2rem; gap:.6rem; overflow:hidden;
          animation:fadeRight .7s ease .2s both;
        }
        @keyframes fadeRight { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
        .lw-prod-card { display:flex; gap:.8rem; align-items:center; padding:.7rem .85rem; border-radius:6px; border:1.5px solid var(--bds); background:var(--bg); cursor:pointer; transition:all .25s; flex-shrink:0; box-shadow:0 1px 4px rgba(0,0,0,.04); }
        .lw-prod-card:hover { border-color:rgba(255,107,0,.3); background:#fff8f4; transform:translateX(-3px); box-shadow:0 4px 16px rgba(255,107,0,.1); }
        .lw-prod-thumb { width:52px; height:64px; border-radius:4px; overflow:hidden; flex-shrink:0; background:var(--bg3); }
        .lw-prod-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .4s; display:block; }
        .lw-prod-card:hover .lw-prod-thumb img { transform:scale(1.08); }
        .lw-prod-info { flex:1; min-width:0; }
        .lw-prod-tag { font-size:.55rem; background:var(--or); color:#fff; padding:2px 8px; border-radius:3px; font-weight:700; letter-spacing:.8px; display:inline-block; margin-bottom:3px; }
        .lw-prod-name { font-size:.8rem; font-weight:600; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .lw-prod-prices { display:flex; align-items:center; gap:5px; margin-top:3px; }
        .lw-prod-now { font-size:.84rem; font-weight:700; color:var(--txt); }
        .lw-prod-old { font-size:.68rem; color:var(--t3); text-decoration:line-through; }
        .lw-prod-add { width:28px; height:28px; border-radius:50%; background:rgba(255,107,0,.1); border:1.5px solid rgba(255,107,0,.3); color:var(--or); font-size:1.1rem; line-height:1; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; flex-shrink:0; }
        .lw-prod-add:hover { background:var(--or); color:#fff; border-color:var(--or); }
        .lw-offer-chip { display:flex; align-items:center; gap:.7rem; padding:.7rem .9rem; border-radius:6px; background:linear-gradient(135deg,#fff4ec,#fff8f4); border:1.5px solid rgba(255,107,0,.18); margin-top:auto; cursor:pointer; }
        .lw-offer-icon { font-size:1.15rem; }
        .lw-offer-text { font-size:.72rem; font-weight:600; color:var(--t2); line-height:1.4; }
        .lw-offer-text strong { color:var(--or); }

        /* ── MARQUEE ── */
        .lw-bar { grid-area:bar; z-index:100; background:var(--or); display:flex; align-items:center; overflow:hidden; }
        .lw-marquee-track { display:flex; gap:2.5rem; width:max-content; animation:marqueeRoll 20s linear infinite; }
        @keyframes marqueeRoll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .lw-marquee-item { font-size:.68rem; font-weight:700; color:#fff; letter-spacing:2px; text-transform:uppercase; white-space:nowrap; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .lw-shell { grid-template-columns: 200px 1fr 260px; }
        }
        @media (max-width: 900px) {
          .lw-shell {
            grid-template-areas: "nav nav nav" "mid mid mid" "bar bar bar";
            grid-template-columns: 1fr;
            grid-template-rows: 60px 1fr 36px;
            overflow:hidden;
          }
          .lw-left, .lw-right { display:none; }
          .lw-hero-img { width:60%; }
          .lw-hero-img::before {
            background:linear-gradient(to right,#ffffff 0%,rgba(255,255,255,0.6) 35%,rgba(255,255,255,0.05) 70%,transparent 100%);
          }
        }
        @media (max-width: 600px) {
          .lw-hero-img { width:100%; }
          .lw-hero-img::before {
            background:linear-gradient(to right,#ffffff 0%,rgba(255,255,255,0.75) 40%,rgba(255,255,255,0.3) 70%,rgba(255,255,255,0.1) 100%);
          }
          .lw-mid { padding:1.5rem; }
          .lw-headline { font-size:2.6rem; }
        }
      `}</style>

      <div className="lw-shell">
        <div className="lw-orb lw-orb-a" />
        <div className="lw-orb lw-orb-b" />
        <div className="lw-orb lw-orb-c" />

        {PARTICLES.map(p => (
          <div key={p.id} className="lw-particle" style={{
            width: p.size, height: p.size,
            left: p.left, bottom: p.bottom,
            '--delay': `${p.delay}s`,
            '--dur':   `${p.duration}s`,
          }} />
        ))}

        {/* ── NAVBAR ── */}
        <nav className="lw-nav">
          <div className="lw-logo-wrap">
            <LuxewearLogo white={false} />
          </div>
          <ul className="lw-nav-links">
            <li><a onClick={() => navigate('/home?category=Women')}>Women</a></li>
            <li><a onClick={() => navigate('/home?category=Men')}>Men</a></li>
            <li><a onClick={() => navigate('/home')}>Collections</a></li>
            <li><a onClick={() => navigate('/home')}>Sale</a></li>
          </ul>
          <div className="lw-nav-actions">
            <button className="lw-btn-ghost"   onClick={handleSignIn}>Sign In</button>
            <button className="lw-btn-nav-cta" onClick={handleShopNow}>Get Started</button>
          </div>
        </nav>

        {/* ── LEFT PANEL ── */}
        <aside className="lw-left">
          <div className="lw-panel-label">Shop by Category</div>
          <div className="lw-cat-list">
            {CATEGORIES.map((c, i) => (
              <div
                key={c.name}
                className={`lw-cat-item${activeCat === i ? ' active' : ''}`}
                onClick={() => { setActiveCat(i); handleCatClick(c.name); }}
              >
                <span className="lw-cat-icon">{c.emoji}</span>
                <div>
                  <div className="lw-cat-name">{c.name}</div>
                  <div className="lw-cat-count">{c.count}</div>
                </div>
                <span className="lw-cat-arrow">→</span>
              </div>
            ))}
          </div>
          <div className="lw-divider" />
          <div className="lw-stat-grid">
            {[['50K+','Customers'],['4.8★','Rating'],['2K+','Products'],['30D','Returns']].map(([v,l]) => (
              <div key={l} className="lw-stat-box">
                <div className="lw-stat-val">{v}</div>
                <div className="lw-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── CENTER PANEL ── */}
        <main className="lw-mid">

          {/* ── HERO IMAGE — CLEAR & FULLY VISIBLE ── */}
          <div className="lw-hero-img">
            <img
              key={`img-${imgKey}`}
              className="lw-img-animate"
              src={s.img}
              alt="fashion hero"
              onError={e => {
                e.target.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1100&fit=crop';
              }}
            />
          </div>

          {/* Slide dots */}
          <div className="lw-dots">
            {SLIDES.map((_, i) => (
              <div key={i} className={`lw-dot${slide === i ? ' active' : ''}`} onClick={() => goTo(i)} />
            ))}
          </div>

          {/* Slide content */}
          <div className="lw-mid-content lw-slide-in" key={`content-${slide}`}>
            <div className="lw-eyebrow">
              <span className="lw-eyebrow-line" />
              New Collection 2026
              <span className="lw-eyebrow-line" />
            </div>
            <h1 className="lw-headline">
              {s.heading}
              <em>{s.highlight}</em>
            </h1>
            <div className="lw-subhead">{s.sub}</div>
            <p className="lw-desc">{s.desc}</p>
            <div className="lw-cta-row">
              <button className="lw-btn-main"    onClick={handleShopNow}>{s.cta} →</button>
              <button className="lw-btn-outline" onClick={handleSignIn}>Sign In</button>
            </div>
          </div>

          {/* Flash badge */}
          <div className="lw-badge">
            <div className="lw-badge-fire">🔥 Flash Sale</div>
            <div className="lw-badge-text">Up to 50% Off Today</div>
          </div>
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className="lw-right">
          <div className="lw-panel-label">Trending Now</div>
          {PRODUCTS.map(p => (
            <div key={p.name} className="lw-prod-card" onClick={handleProduct}>
              <div className="lw-prod-thumb">
                <img src={p.img} alt={p.name}
                  onError={e => { e.target.src='https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=260&fit=crop'; }} />
              </div>
              <div className="lw-prod-info">
                <span className="lw-prod-tag">{p.tag}</span>
                <div className="lw-prod-name">{p.name}</div>
                <div className="lw-prod-prices">
                  <span className="lw-prod-now">{p.price}</span>
                  <span className="lw-prod-old">{p.orig}</span>
                </div>
              </div>
              <button className="lw-prod-add" onClick={e => { e.stopPropagation(); handleShopNow(); }}>+</button>
            </div>
          ))}
          <div className="lw-offer-chip" onClick={handleShopNow}>
            <div className="lw-offer-icon">🎁</div>
            <div className="lw-offer-text">
              <strong>20% off</strong> your first order.<br />
              Create a free account today.
            </div>
          </div>
        </aside>

        {/* ── MARQUEE ── */}
        <div className="lw-bar">
          <div className="lw-marquee-track">
            {[...OFFERS, ...OFFERS].map((item, i) => (
              <span key={i} className="lw-marquee-item">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}