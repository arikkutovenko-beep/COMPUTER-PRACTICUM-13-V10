// ==========================================================================
// ПРАКТИКУМ №6: ПОЧАТКОВІ ДАНІ ТА ОБРОБКА МАСИВУ
// ==========================================================================

const initialTrips = [
    {
        id: '1',
        destination: 'Париж, Франція', 
        startDay: '15.06.2026', 
        endDay: '22.06.2026', 
        days: 7, 
        budget: 1200, 
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/paris.jpg',
        imgAlt: 'Вид на Ейфелеву вежу ввечері',
        stops: [
            { stopId: '101', name: 'Лувр', description: 'Екскурсія музеєм та огляд Мона Лізи', duration: '4 години' },
            { stopId: '102', name: 'Ейфелева вежа', description: 'Підйом на верхній рівень під час заходу сонця', duration: '2 години' }
        ]
    },
    {
        id: '2',
        destination: 'Рим, Італія', 
        startDay: '10.09.2026', 
        endDay: '18.09.2026', 
        days: 8, 
        budget: 1500, 
        status: '⏳ В процесі бронювання',
        badgeClass: 'badge--in-progress',
        imgSrc: 'assets/img/rome.jpg',
        imgAlt: 'Колізей у Римі під сонячним промінням',
        stops: [
            { stopId: '201', name: 'Колізей', description: 'Антична арена гладіаторів', duration: '3 години' },
            { stopId: '202', name: 'Фонтан Треві', description: 'Традиційний кидок монетки на удачу', duration: '1 година' }
        ]
    },
    {
        id: '3',
        destination: 'Барселона, Іспанія', 
        startDay: '05.10.2026', 
        endDay: '12.10.2026', 
        days: 7, 
        budget: 900, 
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/barcelona.jpg',
        imgAlt: 'Храм Святого Сімейства в Барселоні',
        stops: [
            { stopId: '301', name: 'Саграда Фамілія', description: 'Шедевр Антонiо Гаудi', duration: '2.5 години' }
        ]
    },
    {
        id: '4',
        destination: 'Відень, Австрія', 
        startDay: '07.10.2026', 
        endDay: '09.10.2026', 
        days: 2, 
        budget: 750, 
        status: '✅ Завершено',
        badgeClass: 'badge--completed',
        imgSrc: 'assets/img/wien.jpg',
        imgAlt: 'Панорама Відня',
        stops: [
            { stopId: '401', name: 'Шенбрунн', description: 'Прогулянка імператорським парком', duration: '3 години' }
        ]
    }
];

const costPerDay = trip => trip.days ? Math.round(trip.budget / trip.days) : 0;

function processTrips(tripList) {
    for (const trip of tripList) {
        let category = trip.budget < 1000 ? 'дешева' : 'дорога';
        const dailyCost = costPerDay(trip);
        console.log(
            `Куди: ${trip.destination} | Тривалість: ${trip.days} днів. ` +
            `Загальний бюджет: €${trip.budget} (${category}) | ` +
            `Витрати на день: ~€${dailyCost}`
        );
    }
}
processTrips(initialTrips);


// ==========================================================================
// ПРАКТИКУМ №8: ВАЛІДАЦІЯ ФОРМИ ТА ДИНАМІЧНИЙ ПЕРЕРАХУНОК
// ==========================================================================

function updateTripMetrics() {
    const startDateInput = document.querySelector("#startDate");
    const endDateInput = document.querySelector("#endDate");
    const budgetInput = document.querySelector("#budget-input") || document.querySelector("#budget");
    const calculatedDaysVal = document.querySelector("#calculated-days-val");
    const dailyBudgetVal = document.querySelector("#daily-budget-val");

    if (!startDateInput || !endDateInput || !budgetInput) return;
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = Number(budgetInput.value);

    if (startVal && endVal) {
        const start = new Date(startVal);
        const end = new Date(endVal);

        if (end < start) {
            endDateInput.setCustomValidity("Дата завершення не може бути раніше дати початку!");
            if (calculatedDaysVal) calculatedDaysVal.textContent = "0";
            if (dailyBudgetVal) dailyBudgetVal.textContent = "0";
            return;
        } else {
            endDateInput.setCustomValidity("");
        }

        const diffInMs = end - start;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1; 

        if (calculatedDaysVal) calculatedDaysVal.textContent = diffInDays;

        if (budgetVal > 0) {
            const dailyCost = Math.round(budgetVal / diffInDays);
            if (dailyBudgetVal) dailyBudgetVal.textContent = dailyCost;

            if (dailyCost < 20) {
                budgetInput.setCustomValidity("Бюджет на день занадто малий (менше 20€/день)!");
            } else {
                budgetInput.setCustomValidity("");
            }
        } else {
            if (dailyBudgetVal) dailyBudgetVal.textContent = "0";
            budgetInput.setCustomValidity("");
        }
    } else {
        if (calculatedDaysVal) calculatedDaysVal.textContent = "0";
        if (dailyBudgetVal) dailyBudgetVal.textContent = "0";
    }
}


// ==========================================================================
// ПРАКТИКУМ №9: REST COUNTRIES API ІНТЕГРАЦІЯ
// ==========================================================================

const REST_COUNTRIES_API_URL = 'https://restcountries.com/v3.1/name/';

function setApiLoading(isLoading) {
    const apiLoadingState = document.querySelector('#api-loading-state');
    const apiFetchBtn = document.querySelector('#api-fetch-btn');
    const apiRefreshBtn = document.querySelector('#api-refresh-btn');

    if (isLoading) {
        if (apiLoadingState) apiLoadingState.style.display = 'block';
        if (apiFetchBtn) apiFetchBtn.disabled = true;
        if (apiRefreshBtn) apiRefreshBtn.disabled = true;
        clearApiError();
    } else {
        if (apiLoadingState) apiLoadingState.style.display = 'none';
        if (apiFetchBtn) apiFetchBtn.disabled = false;
        if (apiRefreshBtn) apiRefreshBtn.disabled = false;
    }
}

function displayApiError(message) {
    const apiErrorDisplay = document.querySelector('#api-error-display');
    if (apiErrorDisplay) {
        apiErrorDisplay.textContent = message;
        apiErrorDisplay.style.display = 'block';
    }
}

function clearApiError() {
    const apiErrorDisplay = document.querySelector('#api-error-display');
    if (apiErrorDisplay) {
        apiErrorDisplay.textContent = '';
        apiErrorDisplay.style.display = 'none';
    }
}

async function loadCountryData() {
    const apiCountryInput = document.querySelector('#api-country-input');
    const searchQuery = apiCountryInput ? apiCountryInput.value.trim() : '';

    if (!searchQuery) {
        displayApiError('Будь ласка, введіть назву країни англійською мовою.');
        return;
    }

    setApiLoading(true);

    try {
        const response = await fetch(`${REST_COUNTRIES_API_URL}${encodeURIComponent(searchQuery)}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Країну не знайдено, перевірте написання.');
            }
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Країну не знайдено, перевірте написання.');
        }

        const country = data[0];

        const countryCardData = {
            id: Date.now().toString(),
            destination: country.name?.common || searchQuery,
            startDay: 'Інфо з API',
            endDay: 'Інфо з API',
            days: 1,
            budget: 0,
            capital: (country.capital && country.capital.length > 0) ? country.capital[0] : 'Не вказано',
            population: country.population ? country.population : 0,
            imgSrc: country.flags?.png || country.flags?.svg || '',
            imgAlt: `Прапор ${country.name?.common || searchQuery}`,
            status: '🌐 Дані з API',
            badgeClass: 'badge--planned',
            isApiData: true,
            stops: []
        };

        if (vueAppInstance) {
            await vueAppInstance.addTripFromApi(countryCardData);
        }

    } catch (error) {
        console.error('Помилка під час виконання fetch-запиту:', error);
        displayApiError(error.message);
    } finally {
        setApiLoading(false);
    }
}


// ==========================================================================
// ПРАКТИКУМ №11: ІНТЕГРАЦІЯ З INDEXEDDB ТА LOCALSTORAGE
// ==========================================================================

const DB_NAME = 'TravelPlannerDB';
const DB_VERSION = 1;
const STORE_NAME = 'tripStops';
const LS_KEY = 'legacy_trip_stops';
const MIGRATED_KEY = 'migrated_to_indexeddb';

function saveToLocalStorage(items) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Помилка збереження в localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Пошкоджені дані в localStorage:', error);
        return [];
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            return reject(new Error('IndexedDB не підтримується у вашому браузері'));
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveItemDB(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function getAllItemsDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(tx.error);
    });
}

async function deleteItemDB(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function migrateFromLocalStorageIfNeeded() {
    const isMigrated = localStorage.getItem(MIGRATED_KEY);
    if (isMigrated) return;

    let legacyData = loadFromLocalStorage();
    if (legacyData.length === 0) {
        legacyData = initialTrips;
        saveToLocalStorage(legacyData);
    }

    for (const item of legacyData) {
        await saveItemDB(item);
    }

    localStorage.setItem(MIGRATED_KEY, 'true');
}


// ==========================================================================
// ПРАКТИКУМ №12: ГЛОБАЛЬНІ ЗМІННІ ТА РЕНДЕР CANVAS-КАРТИ
// ==========================================================================

let routeAnimId = null;

function drawRouteMap(trips) {
    const canvas = document.getElementById('routeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (routeAnimId) {
        cancelAnimationFrame(routeAnimId);
        routeAnimId = null;
    }

    const validTrips = trips.filter(t => !t.isApiData);

    if (validTrips.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#028090';
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Додайте подорожі, щоб побудувати інтерактивний маршрут', canvas.width / 2, canvas.height / 2);
        return;
    }

    const padding = 70;
    const stepX = validTrips.length > 1 ? (canvas.width - padding * 2) / (validTrips.length - 1) : 0;
    
    const points = validTrips.map((trip, idx) => {
        let val = trip.startDay || trip.startDate || trip.date || '';
        let formattedDate = '';
        if (val && typeof val === 'string' && val.trim() !== '') {
            let cleanVal = val.trim();
            if (!cleanVal.toLowerCase().includes('undef') && !cleanVal.toLowerCase().includes('null')) {
                formattedDate = cleanVal.length >= 5 ? cleanVal.slice(0, 5) : cleanVal;
            }
        }

        return {
            x: validTrips.length === 1 ? canvas.width / 2 : padding + idx * stepX,
            y: 120 + (idx % 2 === 0 ? -35 : 35),
            title: trip.destination ? trip.destination.split(',')[0] : '',
            dates: formattedDate
        };
    });

    let progress = 0;

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (points.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = '#028090';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                const segmentProgress = Math.min(Math.max((progress - (i - 1) / (points.length - 1)) * (points.length - 1), 0), 1);
                const currentX = points[i - 1].x + (points[i].x - points[i - 1].x) * segmentProgress;
                const currentY = points[i - 1].y + (points[i].y - points[i - 1].y) * segmentProgress;
                ctx.lineTo(currentX, currentY);
            }
            ctx.stroke();
            ctx.restore();
        }

        points.forEach((pt, index) => {
            const threshold = index / Math.max(points.length - 1, 1);
            if (progress >= threshold || points.length === 1) {
                ctx.save();
                
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(244, 162, 97, 0.3)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#f4a261';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#028090';
                ctx.stroke();

                ctx.fillStyle = '#2c3e50';
                ctx.font = 'bold 13px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText(pt.title, pt.x, pt.y - 16);

                if (pt.dates) {
                    ctx.fillStyle = '#00a896';
                    ctx.font = '11px system-ui';
                    ctx.fillText(pt.dates, pt.x, pt.y + 20);
                }

                ctx.restore();
            }
        });

        if (progress < 1) {
            progress += 0.025;
            routeAnimId = requestAnimationFrame(animate);
        }
    };

    animate();
}


// ==========================================================================
// ПРАКТИКУМ №10: ДЕКЛАРАТИВНІ КОМПОНЕНТИ ТА РЕАКТИВНИЙ СТАН VUE 3
// ==========================================================================

let vueAppInstance = null;

const TripCard = {
    props: {
        id: [String, Number],
        destination: String,
        days: Number,
        budget: Number,
        startDay: String,
        endDay: String,
        status: String,
        badgeClass: String,
        imgSrc: String,
        imgAlt: String,
        isApiData: Boolean,
        capital: String,
        population: Number
    },
    emits: ['delete-trip'],
    computed: {
        costPerDay() {
            if (!this.days || this.days <= 0) return 0;
            return Math.round(this.budget / this.days);
        },
        getStart() {
            if (this.startDay && !String(this.startDay).includes('undefined')) return this.startDay;
            return '—';
        },
        getEnd() {
            if (this.endDay && !String(this.endDay).includes('undefined')) return this.endDay;
            return '—';
        }
    },
    template: `
        <article class="card" :class="budget ? (budget < 1000 ? 'budget' : 'expensive') : ''">
            <h3>{{ destination }}</h3>
            <img v-if="imgSrc" :src="imgSrc" :alt="imgAlt || destination">
            
            <p v-if="isApiData">
                Столиця: <strong>{{ capital }}</strong><br>
                Населення: <strong>{{ population ? population.toLocaleString('uk-UA') : 0 }}</strong> осіб
            </p>
            <p v-else>
                Дати: {{ getStart }} – {{ getEnd }} ({{ days || 0 }} днів, €{{ budget || 0 }})<br>
                <small>Витрати на день: ~€{{ costPerDay }}</small>
            </p>

            <span class="badge" :class="badgeClass">{{ status }}</span>
            
            <!-- Посилання з префіксом хеша #/ для клієнтського роутингу -->
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <a :href="'#/trip/' + id" data-link style="flex-grow: 1; text-align: center; padding: 8px 12px; background: #028090; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
                    Деталі та маршрут →
                </a>
                <button type="button" class="btn-delete" style="background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;" @click.stop="$emit('delete-trip')">
                    Видалити
                </button>
            </div>
        </article>
    `
};

function mountVueList() {
    const vueMountNode = document.getElementById('vue-list-root');
    if (!vueMountNode) return;

    const app = Vue.createApp({
        components: { TripCard },
        data() {
            return { trips: [] };
        },
        methods: {
            async addTripFromForm(newTrip) {
                await saveItemDB(newTrip);
                await this.loadTripsFromDB();
            },
            async addTripFromApi(apiTrip) {
                await saveItemDB(apiTrip);
                await this.loadTripsFromDB();
            },
            async deleteTrip(id) {
                if (!confirm('Видалити цей пункт маршруту?')) return;
                try {
                    await deleteItemDB(id);
                    await this.loadTripsFromDB();
                } catch (error) {
                    console.error('Помилка видалення з IndexedDB:', error);
                }
            },
            async loadTripsFromDB() {
                try {
                    const items = await getAllItemsDB();
                    
                    items.sort((a, b) => {
                        if (!a.startDay || !b.startDay) return 0;
                        const dateA = String(a.startDay).split('.').reverse().join('-');
                        const dateB = String(b.startDay).split('.').reverse().join('-');
                        return new Date(dateA) - new Date(dateB);
                    });
                    
                    this.trips = items;

                    this.$nextTick(() => {
                        drawRouteMap(this.trips);
                    });
                } catch (error) {
                    console.error('Помилка завантаження з IndexedDB:', error);
                }
            }
        },
        async mounted() {
            await migrateFromLocalStorageIfNeeded();
            await this.loadTripsFromDB();
        }
    });

    vueAppInstance = app.mount('#vue-list-root');
}


// ==========================================================================
// ПРАКТИКУМ №13: ОДНОСТОРІНКОВІ ЗАСТОСУНКИ (SPA) ТА КЛІЄНТСЬКА МАРШРУТИЗАЦІЯ
// ==========================================================================

// Крок 2: Виділення єдиного контейнера сторінки для рендеру всіх Views
const appContainer = document.getElementById('app');

// Крок 5: View-функція для головної сторінки (список поїздок, форма, API, Canvas-карта)
function renderTripsList() {
    appContainer.innerHTML = `
        <section class="form-section">
            <h2>Додати нову подорож</h2>
            <form id="travel-form">
                <div class="form-group">
                    <label for="destination">Пункт призначення:</label>
                    <input type="text" id="destination" required placeholder="Наприклад: Барселона">
                </div>
                <div class="form-group">
                    <label for="startDate">Дата початку:</label>
                    <input type="date" id="startDate" required>
                </div>
                <div class="form-group">
                    <label for="endDate">Дата завершення:</label>
                    <input type="date" id="endDate" required>
                </div>
                <div class="form-group">
                    <label for="budget-input">Загальний бюджет (€):</label>
                    <input type="number" id="budget-input" required min="0" placeholder="500">
                </div>
                <div id="cost-per-day-info" class="info-message">
                    Тривалість: <span id="calculated-days-val">0</span> днів | 
                    Денний бюджет: <span id="daily-budget-val">0</span> €/день
                </div>
                <button type="submit">Додати подорож</button>
            </form>
        </section>

        <section id="trips">
            <h2>Мої подорожі</h2>
            
            <div class="api-controls-container" style="margin: 15px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
                <h3 style="margin-top: 0; color: #0056b3;">Пошук інформації про країну (REST Countries API)</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                    <input type="text" id="api-country-input" placeholder="Введіть назву країни англійською (France, Ukraine, Japan)" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <button type="button" id="api-fetch-btn" style="padding: 8px 15px; background-color: #008080; color: white; border: none; border-radius: 4px; cursor: pointer;">Завантажити країну</button>
                    <button type="button" id="api-refresh-btn" style="padding: 8px 15px; background-color: #008080; color: white; border: none; border-radius: 4px; cursor: pointer;">Оновити</button>
                </div>
                <div id="api-loading-state" style="display: none; color: #0056b3; font-weight: bold; margin: 5px 0;">⏳ Завантаження даних з сервера...</div>
                <div id="api-error-display" style="display: none; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin: 5px 0;"></div>
            </div>

            <div id="vue-list-root">
                <div class="cards">
                    <trip-card 
                        v-for="trip in trips" 
                        :key="trip.id || trip.destination"
                        :id="trip.id"
                        :destination="trip.destination"
                        :days="trip.days"
                        :budget="trip.budget"
                        :start-day="trip.startDay"
                        :end-day="trip.endDay"
                        :status="trip.status"
                        :badge-class="trip.badgeClass"
                        :img-src="trip.imgSrc"
                        :img-alt="trip.imgAlt"
                        :is-api-data="trip.isApiData"
                        :capital="trip.capital"
                        :population="trip.population"
                        @delete-trip="deleteTrip(trip.id)">
                    </trip-card>
                </div>
            </div>
        </section>

        <section id="route-map-section" style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-top: 25px;">
            <h2 style="margin-top: 0; color: #028090;">Карта маршруту (Canvas API)</h2>
            <p style="font-size: 0.9rem; color: #666;">Схематичне відображення зв'язку між пунктами вашої подорожі в хронологічному порядку.</p>
            <div style="text-align: center; overflow-x: auto;">
                <canvas id="routeCanvas" width="700" height="280" style="background-color: #f0fdfa; border: 1px solid #00a896; border-radius: 8px; max-width: 100%; height: auto;"></canvas>
            </div>
        </section>
    `;

    mountVueList();
    attachFormAndApiEvents();
}

// Крок 5 та Крок 8: View-функція для сторінки деталей конкретної поїздки (/trip/:id)
async function renderTripDetails(params) {
    const items = await getAllItemsDB();
    const trip = items.find(t => String(t.id) === String(params.id));

    if (!trip) {
        renderNotFound();
        return;
    }

    const stops = trip.stops || [];

    // Універсальний розрахунок дат без undefined
    let sDay = trip.startDay || trip.startDate || '—';
    let eDay = trip.endDay || trip.endDate || '—';
    if (String(sDay).includes('undefined')) sDay = '—';
    if (String(eDay).includes('undefined')) eDay = '—';

    let html = `
        <div style="margin-bottom: 20px;">
            <a href="#/" data-link style="color: #028090; font-weight: bold; text-decoration: none;">← Повернутися до всіх поїздок</a>
        </div>
        <section class="card" style="padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h2>Маршрут: ${trip.destination}</h2>
            <p><strong>Дати:</strong> ${sDay} – ${eDay} (${trip.days || 0} днів)</p>
            <p><strong>Бюджет:</strong> €${trip.budget || 0}</p>
            <p><strong>Статус:</strong> ${trip.status || 'Заплановано'}</p>

            <h3 style="margin-top: 25px; color: #028090;">Пункти зупинки:</h3>
    `;

    if (stops.length === 0) {
        html += `<p>У цієї поїздки ще немає збережених пунктів зупинки.</p>`;
    } else {
        html += `<ul style="list-style: none; padding: 0;">`;
        stops.forEach(stop => {
            html += `
                <li style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #fafafa;">
                    <strong>${stop.name}</strong> (${stop.duration})<br>
                    <p style="margin: 5px 0;">${stop.description}</p>
                    <a href="#/trip/${trip.id}/stop/${stop.stopId}" data-link style="color: #008080; font-weight: bold; text-decoration: none;">Деталі цієї зупинки →</a>
                </li>
            `;
        });
        html += `</ul>`;
    }

    html += `
            <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee;">
                <h3>Замітки до цієї поїздки:</h3>
                <input type="text" placeholder="Введіть нотатки" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
            </div>
        </section>
    `;

    appContainer.innerHTML = html;
}

// Крок 5: View-функція для зупинки з двома параметрами в одному патерні (/trip/:id/stop/:stopId)
async function renderStopDetails(params) {
    const items = await getAllItemsDB();
    const trip = items.find(t => String(t.id) === String(params.id));
    const stop = trip?.stops?.find(s => String(s.stopId) === String(params.stopId));

    if (!trip || !stop) {
        renderNotFound();
        return;
    }

    appContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
            <a href="#/trip/${trip.id}" data-link style="color: #028090; font-weight: bold; text-decoration: none;">← Назад до поїздки "${trip.destination}"</a>
        </div>
        <section class="card" style="padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h2>Зупинка: ${stop.name}</h2>
            <p><strong>Подорож:</strong> ${trip.destination}</p>
            <p><strong>Запланована тривалість:</strong> ${stop.duration}</p>
            <p><strong>Детальний опис:</strong> ${stop.description}</p>
        </section>
    `;
}

// Крок 9: Обробити неіснуючий маршрут (Сторінка 404)
function renderNotFound() {
    appContainer.innerHTML = `
        <section style="text-align: center; padding: 40px 20px;">
            <h1 style="font-size: 3rem; color: #dc3545; margin-bottom: 10px;">404</h1>
            <h2>Сторінку не знайдено</h2>
            <p>Маршрут не існує або поїздку було видалено.</p>
            <a href="#/" data-link style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #028090; color: white; border-radius: 6px; text-decoration: none;">Повернутися на головну</a>
        </section>
    `;
}

// Крок 3: Описати таблицю маршрутів (Варіант 10 — Планувальник подорожей)
const routes = [
    { path: '/', view: renderTripsList },
    { path: '/trip/:id', view: renderTripDetails },
    { path: '/trip/:id/stop/:stopId', view: renderStopDetails }
];

// Крок 4: Реалізувати matchRoute(path) для порівняння шляхів і витягування параметрів :id та :stopId
function matchRoute(path) {
    const pathParts = path.split('/').filter(Boolean);

    for (const route of routes) {
        const routeParts = route.path.split('/').filter(Boolean);
        
        if (routeParts.length !== pathParts.length) continue;

        const params = {};
        const isMatch = routeParts.every((part, i) => {
            if (part.startsWith(':')) {
                params[part.slice(1)] = pathParts[i];
                return true;
            }
            return part === pathParts[i];
        });

        if (isMatch) {
            return { view: route.view, params };
        }
    }

    return null;
}

// Крок 6 та 7: Клієнтський роутер (Hash-based навігація)
function router() {
    const rawHash = location.hash.slice(1);
    const currentPath = rawHash || '/';
    
    const match = matchRoute(currentPath);

    if (match) {
        match.view(match.params);
    } else {
        renderNotFound();
    }
}

function attachFormAndApiEvents() {
    const startDateInput = document.querySelector("#startDate");
    const endDateInput = document.querySelector("#endDate");
    const budgetInput = document.querySelector("#budget-input") || document.querySelector("#budget");

    if (startDateInput) startDateInput.addEventListener("input", updateTripMetrics);
    if (endDateInput) endDateInput.addEventListener("input", updateTripMetrics);
    if (budgetInput) budgetInput.addEventListener("input", updateTripMetrics);

    const travelForm = document.querySelector('#travel-form');
    const destinationInput = document.querySelector('#destination');

    if (travelForm) {
        travelForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            let formattedStart = 'Не вказано';
            let formattedEnd = 'Не вказано';
            let daysCount = 1;

            if (startDateInput && startDateInput.value && endDateInput && endDateInput.value) {
                const startParts = startDateInput.value.split('-');
                const endParts = endDateInput.value.split('-');

                if (startParts.length === 3) formattedStart = `${startParts[2]}.${startParts[1]}.${startParts[0]}`;
                if (endParts.length === 3) formattedEnd = `${endParts[2]}.${endParts[1]}.${endParts[0]}`;

                const start = new Date(startDateInput.value);
                const end = new Date(endDateInput.value);
                daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            }

            const newTrip = {
                id: Date.now().toString(),
                destination: destinationInput ? destinationInput.value.trim() : 'Нова подорож',
                startDay: formattedStart,
                endDay: formattedEnd,
                days: daysCount || 1,
                budget: budgetInput ? Number(budgetInput.value) : 0,
                status: '✈️ Заплановано',
                badgeClass: 'badge--planned',
                imgSrc: 'assets/img/barcelona.jpg',
                imgAlt: destinationInput ? destinationInput.value.trim() : 'Подорож',
                stops: []
            };

            const currentLsData = loadFromLocalStorage();
            saveToLocalStorage([...currentLsData, newTrip]);

            if (vueAppInstance) {
                await vueAppInstance.addTripFromForm(newTrip);
            }

            travelForm.reset();
            const calculatedDaysVal = document.querySelector("#calculated-days-val");
            const dailyBudgetVal = document.querySelector("#daily-budget-val");
            if (calculatedDaysVal) calculatedDaysVal.textContent = '0';
            if (dailyBudgetVal) dailyBudgetVal.textContent = '0';
        });
    }

    const apiFetchBtn = document.querySelector('#api-fetch-btn');
    const apiRefreshBtn = document.querySelector('#api-refresh-btn');
    const apiCountryInput = document.querySelector('#api-country-input');

    if (apiFetchBtn) apiFetchBtn.addEventListener('click', loadCountryData);
    if (apiRefreshBtn) apiRefreshBtn.addEventListener('click', loadCountryData);

    if (apiCountryInput) {
        apiCountryInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                loadCountryData();
            }
        });
    }
}

// Крок 7 та 10: Слухачі подій hashchange та DOMContentLoaded для перемальовування сторінок
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);