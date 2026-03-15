// 1. 初期設定
const map = L.map('map').setView([34.8893, 135.7003], 15);
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenCycleMap contributors'
}).addTo(map);

// 2. 変数管理
let currentMarker = null;
let isTracking = false; 
let startTime = 0;
let timerInterval = null;
let totalDistance = 0;
let lastLatLng = null;

// 3. 計測・表示更新関数
function updateLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const currentLatLng = L.latLng(lat, lon);

    // --- A. 現在地マーカーの表示（これは常に実行） ---
    if (currentMarker) {
        currentMarker.setLatLng(currentLatLng);
    } else {
        currentMarker = L.circleMarker(currentLatLng, {
            radius: 10, color: '#FFFFFF', weight: 3, fillColor: '#0078FF', fillOpacity: 1
        }).addTo(map);
        map.setView(currentLatLng, 16);
    }

    // --- B. メーターの計算（ボタンがONの時だけ実行） ---
    if (isTracking) {
        // スピード更新
        const speedKmh = (position.coords.speed || 0) * 3.6;
        document.getElementById('speed').textContent = speedKmh.toFixed(1);

        // 距離計算
        if (lastLatLng) {
            const distanceStep = lastLatLng.distanceTo(currentLatLng) / 1000;
            if (distanceStep > 0.002) { 
                totalDistance += distanceStep;
                document.getElementById('dist').textContent = totalDistance.toFixed(1);
            }
        }
        lastLatLng = currentLatLng;
    } else {
        // 計測中でない時は、次回の距離計算のために現在地を記録だけしておく
        lastLatLng = currentLatLng;
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

// 5. スタート・ストップ切り替え（赤いボタン）
function toggleTracking() {
    const btn = document.querySelector('.btn-primary');
    
    if (!isTracking) {
        isTracking = true;
        // 続きから計測できるように開始時間を調整
        startTime = Date.now() - (startTime ? (Date.now() - startTime) : 0);
        timerInterval = setInterval(runTimer, 1000);
        btn.style.animation = "pulse 1.5s infinite"; // 点滅開始
    } else {
        isTracking = false;
        clearInterval(timerInterval);
        btn.style.animation = "none"; // 点滅停止
    }
}

// 6. 位置情報の監視（常に実行）
navigator.geolocation.watchPosition(updateLocation, (err) => console.error(err), {
    enableHighAccuracy: true,
    maximumAge: 0
});

// ボタンとの紐付け
window.jumpToCurrentLocation = toggleTracking;
