// 1. 初期設定
const map = L.map('map').setView([34.8893, 135.7003], 15);
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenCycleMap contributors'
}).addTo(map);

// 2. 変数管理
let currentMarker = null;
let isTracking = false; // 計測中かどうか
let startTime = 0;
let timerInterval = null;
let totalDistance = 0;
let lastLatLng = null;

// 3. メーター更新関数
function updateStats(position) {
    if (!isTracking) return;

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const currentLatLng = L.latLng(lat, lon);

    // スピード更新 (m/s から km/h に変換)
    const speedKmh = (position.coords.speed || 0) * 3.6;
    document.getElementById('speed').textContent = speedKmh.toFixed(1);

    // 距離計算
    if (lastLatLng) {
        const distanceStep = lastLatLng.distanceTo(currentLatLng) / 1000; // km単位
        if (distanceStep > 0.002) { // 誤差（2m以内）は無視
            totalDistance += distanceStep;
            document.getElementById('dist').textContent = totalDistance.toFixed(1);
        }
    }
    lastLatLng = currentLatLng;

    // 現在地マーカー移動
    if (currentMarker) {
        currentMarker.setLatLng(currentLatLng);
    } else {
        currentMarker = L.circleMarker(currentLatLng, {
            radius: 10, color: '#FFFFFF', weight: 3, fillColor: '#0078FF', fillOpacity: 1
        }).addTo(map);
        map.setView(currentLatLng, 16);
    }
}

// 4. タイマー関数
function runTimer() {
    const now = Date.now();
    const diff = new Date(now - startTime);
    const h = String(diff.getUTCHours()).padStart(2, '0');
    const m = String(diff.getUTCMinutes()).padStart(2, '0');
    const s = String(diff.getUTCSeconds()).padStart(2, '0');
    document.getElementById('time').textContent = `${h}:${m}:${s}`;
}

// 5. スタート・ストップ切り替え（赤いボタンに連動）
function toggleTracking() {
    const btn = document.querySelector('.btn-primary'); // 赤いボタン
    
    if (!isTracking) {
        // スタート
        isTracking = true;
        startTime = Date.now() - (startTime ? (Date.now() - startTime) : 0);
        timerInterval = setInterval(runTimer, 1000);
        btn.style.animation = "pulse 1.5s infinite"; // 点滅演出
        console.log("計測開始");
    } else {
        // ストップ
        isTracking = false;
        clearInterval(timerInterval);
        btn.style.animation = "none";
        console.log("計測停止");
    }
}

// 6. 位置情報の監視
navigator.geolocation.watchPosition(updateStats, (err) => console.error(err), {
    enableHighAccuracy: true,
    maximumAge: 0
});

// HTML側のボタンから呼び出すためにグローバルに登録
window.jumpToCurrentLocation = toggleTracking; 
