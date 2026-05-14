(function () {
    'use strict';

    const DYP = window.DYP = {
        toast(opts) {
            const { type = 'info', title = '', message = '', duration = 4200 } = opts || {};
            let host = document.querySelector('.dyp-toast-container');
            if (!host) {
                host = document.createElement('div');
                host.className = 'dyp-toast-container';
                document.body.appendChild(host);
            }
            const icons = { success: 'check-circle-fill', error: 'exclamation-octagon-fill', info: 'info-circle-fill' };
            const t = document.createElement('div');
            t.className = `dyp-toast ${type}`;
            t.innerHTML = `
                <div class="dyp-toast-icon"><i class="bi bi-${icons[type] || 'bell-fill'}"></i></div>
                <div class="dyp-toast-body">
                    ${title ? `<div class="dyp-toast-title"></div>` : ''}
                    <div class="dyp-toast-msg"></div>
                </div>
                <button type="button" class="dyp-toast-close" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
            `;
            if (title) t.querySelector('.dyp-toast-title').textContent = title;
            t.querySelector('.dyp-toast-msg').textContent = message;
            host.appendChild(t);
            requestAnimationFrame(() => t.classList.add('show'));
            const close = () => {
                t.classList.add('hide');
                setTimeout(() => t.remove(), 400);
            };
            t.querySelector('.dyp-toast-close').addEventListener('click', close);
            if (duration > 0) setTimeout(close, duration);
            return { close };
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const navbar = document.querySelector('.dyp-navbar');
        if (navbar) {
            const onScroll = () => {
                if (window.scrollY > 8) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        document.querySelectorAll('.alert.alert-success, .alert.alert-danger').forEach(function (alert) {
            const txt = alert.textContent.trim();
            if (!txt) return;
            const isOk = alert.classList.contains('alert-success');
            DYP.toast({
                type: isOk ? 'success' : 'error',
                title: isOk ? 'Éxito' : 'Atención',
                message: txt
            });
            alert.remove();
        });

        document.querySelectorAll('[data-confirm]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                if (!confirm(this.dataset.confirm)) e.preventDefault();
            });
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.dyp-reveal, .dyp-reveal-stagger').forEach(el => observer.observe(el));

        const fab = document.createElement('button');
        fab.className = 'dyp-fab';
        fab.setAttribute('aria-label', 'Volver arriba');
        fab.innerHTML = '<i class="bi bi-arrow-up"></i>';
        document.body.appendChild(fab);
        const onScrollTop = () => {
            if (window.scrollY > 600) fab.classList.add('show');
            else fab.classList.remove('show');
        };
        window.addEventListener('scroll', onScrollTop, { passive: true });
        fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.querySelectorAll('form[data-cart-add]').forEach(function (form) {
            form.addEventListener('submit', function () {
                const btn = form.querySelector('button[type=submit]');
                if (btn && !btn.disabled) {
                    btn.dataset.original = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Añadiendo...';
                }
            });
        });

        document.querySelectorAll('[data-qty]').forEach(function (wrap) {
            const input = wrap.querySelector('input');
            if (!input) return;
            const max = parseInt(input.getAttribute('max') || '99', 10);
            const min = parseInt(input.getAttribute('min') || '1', 10);
            wrap.querySelectorAll('button').forEach(function (b) {
                b.addEventListener('click', function () {
                    let v = parseInt(input.value, 10) || min;
                    if (b.dataset.action === 'inc') v = Math.min(v + 1, max);
                    else v = Math.max(v - 1, min);
                    input.value = v;
                    input.dispatchEvent(new Event('change'));
                });
            });
        });

        document.querySelectorAll('[data-image-preview-source]').forEach(function (input) {
            const target = document.querySelector(input.dataset.imagePreviewSource);
            if (!target) return;
            const apply = () => {
                const v = (input.value || '').trim();
                if (v) {
                    target.style.backgroundImage = `url("${v}")`;
                    target.classList.add('has-img');
                    target.textContent = '';
                } else {
                    target.style.backgroundImage = '';
                    target.classList.remove('has-img');
                    target.textContent = 'La vista previa de la imagen aparecerá aquí';
                }
            };
            input.addEventListener('input', apply);
            input.addEventListener('change', apply);
            apply();
        });

        document.querySelectorAll('[data-pwd-strength-target]').forEach(function (input) {
            const bar = document.querySelector(input.dataset.pwdStrengthTarget);
            const label = document.querySelector(input.dataset.pwdStrengthLabel || '');
            if (!bar) return;
            const score = (v) => {
                let s = 0;
                if (!v) return 0;
                if (v.length >= 6) s++;
                if (v.length >= 10) s++;
                if (/[A-Z]/.test(v)) s++;
                if (/[0-9]/.test(v)) s++;
                if (/[^A-Za-z0-9]/.test(v)) s++;
                return Math.min(s, 4);
            };
            const colors = ['#ff2d4d', '#ff2d4d', '#ffb547', '#4ea1ff', '#1ed688'];
            const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'];
            input.addEventListener('input', function () {
                const s = score(input.value);
                bar.style.width = ((s / 4) * 100) + '%';
                bar.style.background = colors[s];
                if (label) {
                    label.textContent = input.value ? labels[s] : '';
                    label.style.color = colors[s];
                }
            });
        });

        document.querySelectorAll('[data-tabs]').forEach(function (group) {
            const tabs = group.querySelectorAll('[data-tab]');
            const panels = document.querySelectorAll('[data-panel]');
            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.style.display = 'none');
                    tab.classList.add('active');
                    const target = document.querySelector('[data-panel="' + tab.dataset.tab + '"]');
                    if (target) target.style.display = '';
                });
            });
        });

        document.querySelectorAll('[data-table-search]').forEach(function (input) {
            const sel = input.dataset.tableSearch;
            input.addEventListener('input', function () {
                const q = input.value.toLowerCase();
                document.querySelectorAll(sel).forEach(function (row) {
                    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });
        });

        document.querySelectorAll('[data-char-counter]').forEach(function (input) {
            const counter = document.querySelector(input.dataset.charCounter);
            const max = parseInt(input.getAttribute('maxlength') || '500', 10);
            if (!counter) return;
            const upd = () => counter.textContent = (input.value.length) + ' / ' + max;
            input.addEventListener('input', upd);
            upd();
        });
    });
})();

/* ============================================================
   DYPSTORE — UX INNOVATIONS PACK (JS)
   ============================================================ */
(function () {
    'use strict';
    if (window.DYPX) return; window.DYPX = {};
    const DYP = window.DYP || (window.DYP = {});

    // ---------- Storage helpers ----------
    const LS = {
        get(k, fb) { try { const v = localStorage.getItem('dypx_' + k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } },
        set(k, v) { try { localStorage.setItem('dypx_' + k, JSON.stringify(v)); } catch (e) { } }
    };

    // ---------- Top loading progress bar ----------
    const topBar = document.createElement('div');
    topBar.className = 'dyp-top-progress';
    document.body.appendChild(topBar);
    let _topT = null;
    DYP.startProgress = function () {
        topBar.classList.add('active'); topBar.style.width = '0%';
        let p = 0; clearInterval(_topT);
        _topT = setInterval(() => { p = Math.min(p + Math.random() * 15, 88); topBar.style.width = p + '%'; }, 220);
    };
    DYP.endProgress = function () {
        clearInterval(_topT); topBar.style.width = '100%';
        setTimeout(() => { topBar.classList.remove('active'); setTimeout(() => { topBar.style.width = '0%'; }, 350); }, 200);
    };
    // Trigger on link clicks (same-origin, non-anchor)
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a');
        if (!a) return;
        if (a.target === '_blank' || a.hasAttribute('download')) return;
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        if (a.host && a.host !== location.host) return;
        DYP.startProgress();
    });
    document.addEventListener('submit', function (e) { if (e.target.tagName === 'FORM') DYP.startProgress(); });
    window.addEventListener('pageshow', DYP.endProgress);
    window.addEventListener('beforeunload', () => { /* keep bar */ });

    // ---------- Theme toggle ----------
    const savedTheme = LS.get('theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    DYP.toggleTheme = function () {
        const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        LS.set('theme', next);
        document.querySelectorAll('.dyp-theme-toggle').forEach(b => {
            b.innerHTML = next === 'light' ? '<i class="bi bi-moon-stars-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
        });
        DYP.toast({ type: 'info', message: next === 'light' ? 'Modo claro activado' : 'Modo oscuro activado', duration: 1800 });
    };

    // ---------- Confetti (canvas-based) ----------
    DYP.confetti = function (opts) {
        opts = opts || {};
        const count = opts.count || 110;
        const canvas = document.createElement('canvas');
        canvas.className = 'dyp-confetti-canvas';
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const colors = ['#ff2d4d', '#ffb547', '#1ed688', '#4ea1ff', '#ffffff'];
        const parts = [];
        const cx = (opts.x !== undefined) ? opts.x : window.innerWidth / 2;
        const cy = (opts.y !== undefined) ? opts.y : window.innerHeight / 3;
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 4 + Math.random() * 9;
            parts.push({
                x: cx, y: cy,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3,
                g: 0.18 + Math.random() * 0.08,
                size: 6 + Math.random() * 6,
                color: colors[(Math.random() * colors.length) | 0],
                rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
                life: 0
            });
        }
        let frame = 0; const max = 130;
        function tick() {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            parts.forEach(p => {
                p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
                ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, 1 - frame / max);
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                ctx.restore();
            });
            if (frame < max) requestAnimationFrame(tick);
            else canvas.remove();
        }
        tick();
    };

    // ---------- Wishlist (localStorage) ----------
    const Wish = DYP.wishlist = {
        all() { return LS.get('wishlist', []); },
        has(id) { return this.all().some(x => x.id === id); },
        toggle(item) {
            const a = this.all();
            const i = a.findIndex(x => x.id === item.id);
            let added;
            if (i >= 0) { a.splice(i, 1); added = false; }
            else { a.push(item); added = true; }
            LS.set('wishlist', a);
            this._refreshUI();
            return added;
        },
        remove(id) {
            const a = this.all().filter(x => x.id !== id);
            LS.set('wishlist', a); this._refreshUI();
        },
        _refreshUI() {
            const list = this.all();
            document.querySelectorAll('.dyp-wish-btn').forEach(b => {
                const id = parseInt(b.dataset.productId, 10);
                if (this.has(id)) b.classList.add('active');
                else b.classList.remove('active');
            });
            const fab = document.getElementById('dypFloatingWish');
            if (fab) {
                if (list.length > 0) { fab.classList.add('show'); fab.querySelector('.count').textContent = list.length; }
                else fab.classList.remove('show');
            }
            const drawerBody = document.getElementById('dypWishBody');
            const titleBadge = document.getElementById('dypWishCount');
            if (titleBadge) titleBadge.textContent = list.length;
            if (drawerBody) {
                if (list.length === 0) {
                    drawerBody.innerHTML = `<div class="dyp-drawer-empty"><i class="bi bi-heart"></i><div class="fw-bold mb-1">Tu lista de deseos está vacía</div><div class="small">Marca tus favoritos con el corazón.</div></div>`;
                } else {
                    drawerBody.innerHTML = list.map(it => `
                        <div class="dyp-drawer-item">
                            <a href="${it.url}"><img src="${it.img || ''}" alt="" /></a>
                            <div class="info">
                                <div class="brand">${it.brand || ''}</div>
                                <a class="name" href="${it.url}">${it.name || ''}</a>
                                <div class="price">$${(it.price || 0).toLocaleString('es-CO')}</div>
                            </div>
                            <button class="remove" data-wish-remove="${it.id}" aria-label="Quitar"><i class="bi bi-x-lg"></i></button>
                        </div>`).join('');
                }
            }
        }
    };

    // ---------- Recently viewed ----------
    DYP.recent = {
        push(item) {
            const a = LS.get('recent', []).filter(x => x.id !== item.id);
            a.unshift(item);
            LS.set('recent', a.slice(0, 12));
        },
        all() { return LS.get('recent', []); },
        renderInto(el, opts) {
            const items = this.all().filter(x => !opts || x.id !== opts.excludeId);
            if (items.length === 0) { el.style.display = 'none'; return; }
            el.style.display = '';
            const rail = el.querySelector('.dyp-recent-rail');
            rail.innerHTML = items.map(it => `
                <a class="dyp-recent-card" href="${it.url}">
                    <div class="img" style="background-image:url('${it.img || ''}')"></div>
                    <div class="body">
                        <div class="name">${it.name || ''}</div>
                        <div class="price">$${(it.price || 0).toLocaleString('es-CO')}</div>
                    </div>
                </a>`).join('');
        }
    };

    // ---------- Compare (max 3) ----------
    const Cmp = DYP.compare = {
        all() { return LS.get('compare', []); },
        has(id) { return this.all().some(x => x.id === id); },
        toggle(item) {
            const a = this.all();
            const i = a.findIndex(x => x.id === item.id);
            if (i >= 0) { a.splice(i, 1); }
            else {
                if (a.length >= 3) { DYP.toast({ type: 'info', title: 'Máximo 3', message: 'Quita uno para añadir otro.' }); return false; }
                a.push(item);
            }
            LS.set('compare', a); this._refreshUI(); return true;
        },
        clear() { LS.set('compare', []); this._refreshUI(); },
        _refreshUI() {
            const list = this.all();
            document.querySelectorAll('.dyp-compare-toggle').forEach(b => {
                const id = parseInt(b.dataset.productId, 10);
                if (this.has(id)) b.classList.add('active'); else b.classList.remove('active');
            });
            const bar = document.getElementById('dypCompareBar');
            if (bar) {
                if (list.length >= 1) { bar.classList.add('show'); bar.querySelector('.count').textContent = list.length; }
                else bar.classList.remove('show');
            }
            const drawerBody = document.getElementById('dypCmpBody');
            if (drawerBody) {
                if (list.length === 0) {
                    drawerBody.innerHTML = `<div class="dyp-drawer-empty"><i class="bi bi-bar-chart-line"></i><div class="fw-bold mb-1">Aún no hay productos a comparar</div><div class="small">Selecciona hasta 3 productos.</div></div>`;
                    return;
                }
                drawerBody.innerHTML = `
                    <div class="dyp-compare-grid">
                        ${list.map(it => `
                            <div class="dyp-compare-card">
                                <button class="remove" data-cmp-remove="${it.id}" aria-label="Quitar"><i class="bi bi-x-lg"></i></button>
                                <div class="img" style="background-image:url('${it.img || ''}')"></div>
                                <div class="body">
                                    <div class="name">${it.name || ''}</div>
                                    <div class="price">$${(it.price || 0).toLocaleString('es-CO')}</div>
                                    <div class="dyp-compare-row"><span class="label">Marca</span><span class="val">${it.brand || '—'}</span></div>
                                    <div class="dyp-compare-row"><span class="label">Categoría</span><span class="val">${it.cat || '—'}</span></div>
                                    <div class="dyp-compare-row"><span class="label">Stock</span><span class="val">${it.stock != null ? it.stock : '—'}</span></div>
                                    <div class="dyp-compare-row"><span class="label">SKU</span><span class="val">DYP-${String(it.id).padStart(5, '0')}</span></div>
                                    <a href="${it.url}" class="btn btn-outline-light btn-sm w-100 mt-3">Ver detalle</a>
                                </div>
                            </div>`).join('')}
                    </div>`;
            }
        }
    };

    // ---------- Drawer helper ----------
    DYP.drawer = function (id, open) {
        const el = document.getElementById(id);
        const bd = document.getElementById('dypDrawerBackdrop');
        if (!el || !bd) return;
        if (open) { el.classList.add('show'); bd.classList.add('show'); document.body.style.overflow = 'hidden'; }
        else {
            el.classList.remove('show'); document.body.style.overflow = '';
            if (!document.querySelector('.dyp-drawer.show')) bd.classList.remove('show');
        }
    };
    DYP.closeAllDrawers = function () {
        document.querySelectorAll('.dyp-drawer.show').forEach(d => d.classList.remove('show'));
        const bd = document.getElementById('dypDrawerBackdrop');
        if (bd) bd.classList.remove('show'); document.body.style.overflow = '';
    };

    // ---------- Voice search ----------
    DYP.voiceSearch = function () {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { DYP.toast({ type: 'error', title: 'No disponible', message: 'Tu navegador no soporta búsqueda por voz. Usa Chrome o Edge.' }); return; }
        const overlay = document.getElementById('dypVoiceOverlay');
        const transcript = document.getElementById('dypVoiceTranscript');
        if (overlay) overlay.classList.add('show');
        if (transcript) transcript.textContent = 'Escuchando...';
        document.querySelectorAll('.dyp-voice-btn').forEach(b => b.classList.add('recording'));
        const r = new SR();
        r.lang = 'es-CO'; r.interimResults = true; r.maxAlternatives = 1;
        let finalT = '';
        r.onresult = (e) => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) finalT += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            if (transcript) transcript.textContent = (finalT + interim).trim() || 'Escuchando...';
        };
        r.onerror = () => { stop(); DYP.toast({ type: 'error', message: 'No pudimos escuchar. Intenta de nuevo.' }); };
        r.onend = () => {
            stop();
            const q = finalT.trim();
            if (q) { window.location.href = (document.querySelector('.dyp-search-pill')?.getAttribute('action') || '/Products') + '?search=' + encodeURIComponent(q); }
        };
        function stop() {
            if (overlay) overlay.classList.remove('show');
            document.querySelectorAll('.dyp-voice-btn').forEach(b => b.classList.remove('recording'));
        }
        try { r.start(); } catch (e) { stop(); }
        // Stop manually if user clicks overlay
        overlay?.addEventListener('click', () => { try { r.stop(); } catch (e) { } }, { once: true });
    };

    // ---------- Smart search autocomplete ----------
    DYP.smartSearch = function (form) {
        const input = form.querySelector('input[type=search]');
        if (!input) return;
        let suggest = form.querySelector('.dyp-search-suggest');
        if (!suggest) {
            suggest = document.createElement('div'); suggest.className = 'dyp-search-suggest';
            form.appendChild(suggest);
        }
        // Build product index from data on page (cards with data-search)
        const buildIndex = () => {
            const set = new Map();
            document.querySelectorAll('[data-search-name]').forEach(el => {
                const id = el.dataset.searchId || el.dataset.productId;
                const name = el.dataset.searchName;
                if (!set.has(id)) set.set(id, { id, name, brand: el.dataset.searchBrand || '', cat: el.dataset.searchCat || '', url: el.dataset.searchUrl || ('/Products/Details/' + id), img: el.dataset.searchImg || '' });
            });
            const recent = (LS.get('recent', []) || []);
            recent.forEach(it => { if (!set.has(String(it.id))) set.set(String(it.id), { id: it.id, name: it.name, brand: it.brand || '', cat: it.cat || '', url: it.url, img: it.img }); });
            return Array.from(set.values());
        };
        let index = buildIndex();
        const popular = ['Guantes de boxeo', 'Proteína whey', 'Tenis running', 'Pre-entreno', 'Vendas', 'Cuerda para saltar', 'Creatina'];
        let focused = -1;
        const render = (q) => {
            if (!q) {
                suggest.innerHTML = `<div class="px-3 pt-2 pb-1 text-secondary small text-uppercase fw-bold" style="letter-spacing:.1em;font-size:.65rem;">Búsquedas populares</div>` +
                    popular.map((p, i) => `<a class="dyp-suggest-item" data-q="${p}"><i class="bi bi-fire"></i><span>${p}</span></a>`).join('');
                suggest.classList.add('show'); return;
            }
            const ql = q.toLowerCase();
            let matches = index.filter(p => (p.name || '').toLowerCase().includes(ql) || (p.brand || '').toLowerCase().includes(ql)).slice(0, 6);
            if (matches.length === 0) {
                suggest.innerHTML = `<div class="dyp-suggest-empty">Sin coincidencias. <a class="text-danger" data-q="${q}">Buscar "${q}" igual</a></div>`;
            } else {
                suggest.innerHTML = matches.map(p => {
                    const hl = (p.name || '').replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
                    return `<a class="dyp-suggest-item" href="${p.url}"><i class="bi bi-search"></i><span>${hl}</span><span class="ms-auto small text-secondary">${p.brand || ''}</span></a>`;
                }).join('');
            }
            suggest.classList.add('show');
        };
        input.addEventListener('focus', () => { index = buildIndex(); render(input.value.trim()); });
        input.addEventListener('input', () => { focused = -1; render(input.value.trim()); });
        input.addEventListener('keydown', (e) => {
            const items = suggest.querySelectorAll('.dyp-suggest-item');
            if (e.key === 'ArrowDown') { e.preventDefault(); focused = (focused + 1) % items.length; items.forEach((x, i) => x.classList.toggle('focus', i === focused)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); focused = (focused - 1 + items.length) % items.length; items.forEach((x, i) => x.classList.toggle('focus', i === focused)); }
            else if (e.key === 'Enter' && focused >= 0) {
                e.preventDefault();
                const item = items[focused];
                if (item.dataset.q) { input.value = item.dataset.q; form.submit(); }
                else if (item.href) window.location.href = item.href;
            }
            else if (e.key === 'Escape') { suggest.classList.remove('show'); input.blur(); }
        });
        suggest.addEventListener('click', (e) => {
            const item = e.target.closest('.dyp-suggest-item');
            if (item && item.dataset.q) { input.value = item.dataset.q; form.submit(); }
        });
        document.addEventListener('click', (e) => { if (!form.contains(e.target)) suggest.classList.remove('show'); });
    };

    // ---------- Social proof rotating popup ----------
    DYP.startSocialProof = function () {
        const products = Array.from(document.querySelectorAll('[data-search-name]')).map(el => ({
            name: el.dataset.searchName, img: el.dataset.searchImg, url: el.dataset.searchUrl
        })).filter(p => p.name).slice(0, 30);
        if (products.length === 0) return;
        const names = ['María de Bogotá', 'Carlos en Medellín', 'Andrés de Cali', 'Lucía en Barranquilla', 'Sofía de Cartagena', 'Daniel en Bucaramanga', 'Camila de Pereira', 'Mateo en Manizales', 'Valentina de Pasto', 'Sebastián en Ibagué'];
        const times = ['hace 2 minutos', 'hace 5 minutos', 'hace 8 minutos', 'hace 12 minutos', 'hace 15 minutos', 'hace 1 hora'];
        const verbs = ['acaba de comprar', 'añadió al carrito', 'compró'];
        const node = document.createElement('div');
        node.className = 'dyp-social-proof';
        node.innerHTML = `<button class="close-it" aria-label="Cerrar"><i class="bi bi-x"></i></button><img alt="" /><div class="text"></div>`;
        document.body.appendChild(node);
        let dismissed = false;
        node.querySelector('.close-it').addEventListener('click', () => { node.classList.remove('show'); dismissed = true; });
        let idx = 0;
        const show = () => {
            if (dismissed) return;
            const p = products[Math.floor(Math.random() * products.length)];
            const who = names[Math.floor(Math.random() * names.length)];
            const when = times[Math.floor(Math.random() * times.length)];
            const verb = verbs[Math.floor(Math.random() * verbs.length)];
            node.querySelector('img').src = p.img || '';
            node.querySelector('.text').innerHTML = `<a href="${p.url}" class="text-decoration-none text-reset"><div><span class="who">${who}</span> ${verb}</div><div class="fw-semibold text-truncate" style="max-width:220px;">${p.name}</div><div class="when"><span class="dot"></span>${when}</div></a>`;
            node.classList.add('show');
            setTimeout(() => { if (!dismissed) node.classList.remove('show'); }, 6500);
        };
        setTimeout(() => { show(); idx++; }, 6000);
        setInterval(() => { if (idx < 6) { show(); idx++; } }, 22000);
    };

    // ---------- Image zoom magnifier ----------
    DYP.initZoom = function (wrap) {
        const img = wrap.querySelector('img');
        if (!img) return;
        const lens = document.createElement('div'); lens.className = 'dyp-zoom-lens'; wrap.appendChild(lens);
        const result = document.createElement('div'); result.className = 'dyp-zoom-result'; wrap.appendChild(result);
        const cx = 2.2; // zoom factor
        function move(e) {
            const r = img.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
            if (x < 0 || y < 0 || x > r.width || y > r.height) { lens.style.display = 'none'; result.style.display = 'none'; return; }
            lens.style.display = 'block'; result.style.display = 'block';
            const lw = lens.offsetWidth / 2, lh = lens.offsetHeight / 2;
            let lx = Math.max(0, Math.min(x - lw, r.width - lens.offsetWidth));
            let ly = Math.max(0, Math.min(y - lh, r.height - lens.offsetHeight));
            lens.style.left = lx + 'px'; lens.style.top = ly + 'px';
            result.style.backgroundImage = `url("${img.src}")`;
            result.style.backgroundSize = (r.width * cx) + 'px ' + (r.height * cx) + 'px';
            result.style.backgroundPosition = '-' + (lx * cx) + 'px -' + (ly * cx) + 'px';
        }
        wrap.addEventListener('mousemove', move);
        wrap.addEventListener('mouseleave', () => { lens.style.display = 'none'; result.style.display = 'none'; });
    };

    // ---------- Quick view modal (uses page data) ----------
    DYP.openQuickView = function (data) {
        const bd = document.getElementById('dypQuickViewBackdrop');
        if (!bd) return;
        bd.querySelector('.dyp-modal-img').style.backgroundImage = `url("${data.img || ''}")`;
        bd.querySelector('[data-qv-brand]').textContent = data.brand || '';
        bd.querySelector('[data-qv-name]').textContent = data.name || '';
        bd.querySelector('[data-qv-cat]').textContent = data.cat || '';
        bd.querySelector('[data-qv-cat]').className = 'dyp-badge-cat dyp-cat-' + (data.cat || '').toLowerCase() + ' me-2'; bd.querySelector('[data-qv-cat]').style.position = 'static';
        bd.querySelector('[data-qv-price]').textContent = '$' + (data.price || 0).toLocaleString('es-CO');
        bd.querySelector('[data-qv-desc]').textContent = data.desc || '';
        bd.querySelector('[data-qv-detail]').href = data.url || '#';
        const stockEl = bd.querySelector('[data-qv-stock]');
        if (data.stock > 5) stockEl.innerHTML = '<span class="dyp-stock-pill">En stock</span>';
        else if (data.stock > 0) stockEl.innerHTML = '<span class="dyp-stock-pill low">¡Quedan ' + data.stock + '!</span>';
        else stockEl.innerHTML = '<span class="dyp-stock-pill out">Agotado</span>';
        bd.classList.add('show'); document.body.style.overflow = 'hidden';
    };
    DYP.closeQuickView = function () {
        const bd = document.getElementById('dypQuickViewBackdrop');
        if (bd) { bd.classList.remove('show'); document.body.style.overflow = ''; }
    };

    // ---------- Flying heart on wishlist add ----------
    DYP.flyHeart = function (fromEl, toSelector) {
        const target = document.querySelector(toSelector || '#dypFloatingWish');
        if (!fromEl || !target) return;
        const a = fromEl.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        const heart = document.createElement('i');
        heart.className = 'bi bi-heart-fill dyp-flying-heart';
        heart.style.left = (a.left + a.width / 2 - 10) + 'px';
        heart.style.top = (a.top + a.height / 2 - 10) + 'px';
        heart.style.setProperty('--fx', (b.left - a.left) + 'px');
        heart.style.setProperty('--fy', (b.top - a.top) + 'px');
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 950);
    };

    // ---------- Cart icon pulse on add ----------
    DYP.pulseCart = function () {
        const c = document.querySelector('.dyp-icon-btn[href*="Cart"] i');
        if (c) { c.classList.remove('dyp-cart-pulse'); void c.offsetWidth; c.classList.add('dyp-cart-pulse'); }
    };

    // ---------- Keyboard shortcuts ----------
    DYP.openShortcuts = function () { const m = document.getElementById('dypKbdModal'); if (m) m.classList.add('show'); };
    DYP.closeShortcuts = function () { const m = document.getElementById('dypKbdModal'); if (m) m.classList.remove('show'); };

    document.addEventListener('keydown', (e) => {
        const tag = (e.target?.tagName || '').toLowerCase();
        if (['input', 'textarea', 'select'].includes(tag) || e.target?.isContentEditable) return;
        if (e.key === '?') { e.preventDefault(); DYP.openShortcuts(); }
        else if (e.key === '/') { e.preventDefault(); document.querySelector('.dyp-search-pill input[type=search]')?.focus(); }
        else if (e.key === 'Escape') {
            DYP.closeAllDrawers(); DYP.closeQuickView(); DYP.closeShortcuts();
            document.getElementById('dypKbdModal')?.classList.remove('show');
        }
        else if (e.key.toLowerCase() === 'w') { DYP.drawer('dypWishDrawer', true); }
        else if (e.key.toLowerCase() === 'c') { DYP.drawer('dypCmpDrawer', true); }
        else if (e.key.toLowerCase() === 't') { DYP.toggleTheme(); }
        else if (e.key.toLowerCase() === 'h') { window.location.href = '/'; }
    });

    // ---------- Init ----------
    document.addEventListener('DOMContentLoaded', function () {
        DYP.endProgress();

        // Apply theme button icon
        const t = document.documentElement.getAttribute('data-theme');
        document.querySelectorAll('.dyp-theme-toggle').forEach(b => {
            b.innerHTML = t === 'light' ? '<i class="bi bi-moon-stars-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
            b.addEventListener('click', DYP.toggleTheme);
        });

        // Voice search bindings
        document.querySelectorAll('.dyp-voice-btn').forEach(b => b.addEventListener('click', DYP.voiceSearch));

        // Smart search on every search form
        document.querySelectorAll('.dyp-search-pill').forEach(DYP.smartSearch);

        // Wishlist clicks
        document.addEventListener('click', (e) => {
            const wb = e.target.closest('.dyp-wish-btn');
            if (wb) {
                e.preventDefault(); e.stopPropagation();
                const item = JSON.parse(wb.dataset.product || '{}');
                const added = Wish.toggle(item);
                if (added) { DYP.flyHeart(wb); DYP.toast({ type: 'success', title: 'Añadido a favoritos', message: item.name }); }
                else DYP.toast({ type: 'info', message: 'Quitado de favoritos' });
            }
            const cb = e.target.closest('.dyp-compare-toggle');
            if (cb) {
                e.preventDefault(); e.stopPropagation();
                const item = JSON.parse(cb.dataset.product || '{}');
                Cmp.toggle(item);
            }
            const qv = e.target.closest('.dyp-quick-view-btn');
            if (qv) {
                e.preventDefault(); e.stopPropagation();
                DYP.openQuickView(JSON.parse(qv.dataset.product || '{}'));
            }
            if (e.target.closest('[data-wish-remove]')) {
                Wish.remove(parseInt(e.target.closest('[data-wish-remove]').dataset.wishRemove, 10));
            }
            if (e.target.closest('[data-cmp-remove]')) {
                const id = parseInt(e.target.closest('[data-cmp-remove]').dataset.cmpRemove, 10);
                const it = Cmp.all().find(x => x.id === id); if (it) Cmp.toggle(it);
            }
        });

        // Drawer open buttons
        document.querySelectorAll('[data-drawer-open]').forEach(b => {
            b.addEventListener('click', (e) => { e.preventDefault(); DYP.drawer(b.dataset.drawerOpen, true); });
        });
        document.querySelectorAll('[data-drawer-close]').forEach(b => {
            b.addEventListener('click', () => { DYP.drawer(b.dataset.drawerClose, false); });
        });
        document.getElementById('dypDrawerBackdrop')?.addEventListener('click', DYP.closeAllDrawers);

        // Quick view backdrop close
        const qvBd = document.getElementById('dypQuickViewBackdrop');
        qvBd?.addEventListener('click', (e) => { if (e.target === qvBd) DYP.closeQuickView(); });
        qvBd?.querySelector('.dyp-modal-close')?.addEventListener('click', DYP.closeQuickView);

        // Compare bar
        const cbar = document.getElementById('dypCompareBar');
        cbar?.querySelector('.open')?.addEventListener('click', () => DYP.drawer('dypCmpDrawer', true));
        cbar?.querySelector('.clear')?.addEventListener('click', () => { Cmp.clear(); DYP.toast({ type: 'info', message: 'Comparación limpiada' }); });

        // Keyboard modal
        document.getElementById('dypKbdModal')?.addEventListener('click', (e) => { if (e.target.id === 'dypKbdModal') DYP.closeShortcuts(); });
        document.querySelector('[data-kbd-open]')?.addEventListener('click', (e) => { e.preventDefault(); DYP.openShortcuts(); });

        // Init wishlist + compare ui
        Wish._refreshUI(); Cmp._refreshUI();

        // Floating wish button
        document.getElementById('dypFloatingWish')?.addEventListener('click', () => DYP.drawer('dypWishDrawer', true));

        // Recently viewed: track if on details page
        const trackEl = document.querySelector('[data-track-recent]');
        if (trackEl) { DYP.recent.push(JSON.parse(trackEl.dataset.trackRecent)); }
        // Render recent strip
        const recentEl = document.querySelector('[data-recent-strip]');
        if (recentEl) {
            const ex = recentEl.dataset.exclude ? parseInt(recentEl.dataset.exclude, 10) : null;
            DYP.recent.renderInto(recentEl, ex ? { excludeId: ex } : null);
        }

        // Image zoom
        document.querySelectorAll('.dyp-zoom-wrap').forEach(DYP.initZoom);

        // Scroll progress
        const sp = document.querySelector('.dyp-scroll-progress');
        if (sp) {
            const upd = () => { const h = document.documentElement; const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100; sp.style.width = Math.min(100, Math.max(0, pct)) + '%'; };
            window.addEventListener('scroll', upd, { passive: true }); upd();
        }

        // Cart-add forms: confetti + cart pulse
        document.querySelectorAll('form[data-cart-add]').forEach(f => {
            // Already disabled-state in main; do not double-bind submit, but listen to fire confetti just before submit
            f.addEventListener('submit', (e) => {
                const r = (e.submitter || f.querySelector('[type=submit]')).getBoundingClientRect();
                DYP.confetti({ x: r.left + r.width / 2, y: r.top, count: 60 });
                DYP.pulseCart();
            });
        });

        // If URL says checkout/order success, big confetti
        if (/order|orden|success|gracias|completed/i.test(location.pathname + location.search)) {
            setTimeout(() => DYP.confetti({ count: 220 }), 250);
        }

        // Social proof popups (only on store pages, not in admin)
        if (!/^\/Admin/i.test(location.pathname)) DYP.startSocialProof();

        // Service worker registration (PWA)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => { });
        }
    });
})();

/* ============================================================
   DYPSTORE — CHATBOT IA (JS)
   ============================================================ */
(function () {
    'use strict';
    if (window.DYPCHAT) return;
    window.DYPCHAT = {};

    const CHATBOT = window.DYPCHAT;
    const isAuthenticated = document.body.dataset.authenticated === 'true';
    const isAdmin = document.body.dataset.admin === 'true';
    const ENDPOINT = isAuthenticated ? '/api/chatbot/message' : '/api/chatbot/public';

    // ── Quick chips: adapt to role ──
    const USER_CHIPS = [
        'Guantes de boxeo', 'Suplementos', 'Tenis deportivos',
        '¿Cuánto cuestan?', 'Categorías', '¿Tienen en stock?'
    ];
    const ADMIN_CHIPS = [
        'Inventario', 'Productos agotados', 'Bajo stock',
        'Usuarios registrados', 'Estadísticas', 'Crear producto'
    ];

    function getChips() { return isAdmin ? ADMIN_CHIPS : USER_CHIPS; }

    // ── DOM references (set on init) ──
    let fab, panel, messagesEl, inputEl, chipsEl;
    let isOpen = false;
    let isLoading = false;

    CHATBOT.init = function () {
        fab = document.getElementById('dypChatFab');
        panel = document.getElementById('dypChatPanel');
        messagesEl = document.getElementById('dypChatMessages');
        inputEl = document.getElementById('dypChatInput');
        chipsEl = document.getElementById('dypChatChips');

        if (!fab || !panel) return;

        // Build chips
        if (chipsEl) {
            chipsEl.innerHTML = getChips().map(c =>
                `<button type="button" class="dyp-chatbot-chip">${c}</button>`
            ).join('');
            chipsEl.querySelectorAll('.dyp-chatbot-chip').forEach(btn => {
                btn.addEventListener('click', () => CHATBOT.send(btn.textContent));
            });
        }

        // Open/close
        fab.addEventListener('click', CHATBOT.toggle);

        // Send on button
        document.getElementById('dypChatSendBtn')?.addEventListener('click', () => {
            const msg = (inputEl?.value || '').trim();
            if (msg) CHATBOT.send(msg);
        });

        // Send on Enter
        inputEl?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const msg = (inputEl.value || '').trim();
                if (msg) CHATBOT.send(msg);
            }
        });

        // Voice inside chatbot
        document.getElementById('dypChatVoiceBtn')?.addEventListener('click', CHATBOT.startVoice);

        // Greeting on first open
        fab.addEventListener('click', function onFirstOpen() {
            CHATBOT.autoGreet();
            fab.removeEventListener('click', onFirstOpen);
        }, { once: true });
    };

    CHATBOT.toggle = function () {
        isOpen = !isOpen;
        fab.classList.toggle('open', isOpen);
        panel.classList.toggle('open', isOpen);
        if (isOpen && inputEl) setTimeout(() => inputEl.focus(), 200);
    };

    CHATBOT.open = function () { if (!isOpen) CHATBOT.toggle(); };
    CHATBOT.close = function () { if (isOpen) CHATBOT.toggle(); };

    CHATBOT.autoGreet = function () {
        const greeting = isAdmin
            ? '¡Hola! Soy tu asistente de DYPStore. Tienes acceso completo de administrador. Puedes preguntarme sobre inventario, usuarios, estadísticas o ejecutar acciones CRUD.'
            : '¡Hola! Soy el asistente de DYPStore. Puedo ayudarte a buscar productos, consultar precios, disponibilidad y más.';
        appendBotBubble(greeting);
    };

    CHATBOT.send = async function (message) {
        if (isLoading || !message) return;

        // Clear input
        if (inputEl) inputEl.value = '';

        // Show user bubble
        appendUserBubble(message);

        // Show typing indicator
        const typing = appendTyping();
        isLoading = true;

        try {
            const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'RequestVerificationToken': token } : {})
                },
                body: JSON.stringify({ message })
            });

            typing.remove();

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                appendBotHtml(`<div class="dyp-chat-error">${err.error || 'Error al conectar con el servidor.'}</div>`);
            } else {
                const data = await res.json();
                appendBotHtml(data.html || '<div class="dyp-chat-empty">Sin respuesta.</div>');
            }
        } catch (e) {
            typing.remove();
            appendBotHtml('<div class="dyp-chat-error">No se pudo conectar. Verifica tu conexión e intenta de nuevo.</div>');
        } finally {
            isLoading = false;
        }
    };

    // ── Voice input for chatbot ──
    CHATBOT.startVoice = function () {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { DYP.toast({ type: 'error', message: 'Tu navegador no soporta voz. Usa Chrome o Edge.' }); return; }

        const voiceBtn = document.getElementById('dypChatVoiceBtn');
        const r = new SR();
        r.lang = 'es-CO'; r.interimResults = true; r.maxAlternatives = 1;
        let finalT = '';

        r.onresult = (e) => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) finalT += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            if (inputEl) inputEl.value = (finalT + interim).trim();
        };

        r.onerror = () => {
            voiceBtn?.classList.remove('recording');
            DYP.toast({ type: 'error', message: 'No pudimos escuchar. Intenta de nuevo.' });
        };

        r.onend = () => {
            voiceBtn?.classList.remove('recording');
            const q = finalT.trim();
            if (q) {
                // Open chat if closed and send
                CHATBOT.open();
                CHATBOT.send(q);
            }
        };

        voiceBtn?.classList.add('recording');
        try { r.start(); } catch (e) { voiceBtn?.classList.remove('recording'); }
    };

    // ── DOM helpers ──
    function appendUserBubble(text) {
        const div = document.createElement('div');
        div.className = 'dyp-chat-msg user';
        div.innerHTML = `<div class="dyp-chat-bubble">${escapeHtml(text)}</div>`;
        messagesEl?.appendChild(div);
        scrollBottom();
    }

    function appendBotBubble(text) {
        appendBotHtml(`<span>${escapeHtml(text)}</span>`);
    }

    function appendBotHtml(html) {
        const div = document.createElement('div');
        div.className = 'dyp-chat-msg bot';
        div.innerHTML = `
            <div class="dyp-chat-avatar"><i class="bi bi-lightning-charge-fill"></i></div>
            <div class="dyp-chat-bubble">${html}</div>`;
        messagesEl?.appendChild(div);
        scrollBottom();
    }

    function appendTyping() {
        const div = document.createElement('div');
        div.className = 'dyp-chat-msg bot dyp-chat-typing';
        div.innerHTML = `
            <div class="dyp-chat-avatar"><i class="bi bi-lightning-charge-fill"></i></div>
            <div class="dyp-chat-bubble">
                <div class="dyp-chat-typing-dots"><span></span><span></span><span></span></div>
            </div>`;
        messagesEl?.appendChild(div);
        scrollBottom();
        return div;
    }

    function scrollBottom() {
        if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ── Enhanced voice search: route admin queries to chatbot ──
    // Override DYP.voiceSearch to also open chatbot for admin commands
    (function patchVoiceSearch() {
        const orig = DYP.voiceSearch;
        DYP.voiceSearch = function () {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) { DYP.toast({ type: 'error', title: 'No disponible', message: 'Tu navegador no soporta búsqueda por voz. Usa Chrome o Edge.' }); return; }
            const overlay = document.getElementById('dypVoiceOverlay');
            const transcript = document.getElementById('dypVoiceTranscript');
            if (overlay) overlay.classList.add('show');
            if (transcript) transcript.textContent = 'Escuchando...';
            document.querySelectorAll('.dyp-voice-btn').forEach(b => b.classList.add('recording'));
            const r = new SR();
            r.lang = 'es-CO'; r.interimResults = true; r.maxAlternatives = 1;
            let finalT = '';
            r.onresult = (e) => {
                let interim = '';
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    if (e.results[i].isFinal) finalT += e.results[i][0].transcript;
                    else interim += e.results[i][0].transcript;
                }
                if (transcript) transcript.textContent = (finalT + interim).trim() || 'Escuchando...';
            };
            r.onerror = () => { stop(); DYP.toast({ type: 'error', message: 'No pudimos escuchar. Intenta de nuevo.' }); };
            r.onend = () => {
                stop();
                const q = finalT.trim();
                if (!q) return;
                // Admin commands or conversational queries → chatbot
                const adminKw = /inventario|stock|agotado|usuarios?|estadistica|crea|elimina|edita|actualiza|precio|bajo stock|sin stock/i;
                const chatKw = /muéstrame|muestrame|cuánto|cuanto|tienen|busca|buscar|categorias?|suplemento|guante|tenis|proteina/i;
                if (isAdmin && adminKw.test(q)) {
                    CHATBOT.open(); CHATBOT.send(q);
                } else if (chatKw.test(q)) {
                    CHATBOT.open(); CHATBOT.send(q);
                } else {
                    // Default: product search redirect
                    window.location.href = (document.querySelector('.dyp-search-pill')?.getAttribute('action') || '/Products') + '?search=' + encodeURIComponent(q);
                }
            };
            function stop() {
                if (overlay) overlay.classList.remove('show');
                document.querySelectorAll('.dyp-voice-btn').forEach(b => b.classList.remove('recording'));
            }
            try { r.start(); } catch (e) { stop(); }
            overlay?.addEventListener('click', () => { try { r.stop(); } catch (e) { } }, { once: true });
        };
    })();

    // ── Init on DOM ready ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', CHATBOT.init);
    } else {
        CHATBOT.init();
    }

})();
