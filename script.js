// 1. 地図の初期化（まずは表示を優先）
const map = L.map('map').setView([34.8893, 135.7003], 15);

L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenCycleMap contributors'
}).addTo(map);

// 2. 変数の準備
let currentMarker = null;

// 3. 位置情報が更新された時の処理
function onLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    if (currentMarker) {
        currentMarker.setLatLng([lat, lon]);
    } else {
        currentMarker = L.circleMarker([lat, lon], {
            radius: 10, // 少し大きくしました
            color: '#FFFFFF',
            weight: 3,
            fillColor: '#0078FF',
            fillOpacity: 1
        }).addTo(map);
        // 初回だけ現在地にジャンプ
        map.setView([lat, lon], 16);
    }
}

function onLocationError(error) {
    console.error("位置情報の取得に失敗しました:", error.message);
}

// 4. ブラウザが準備完了してから位置情報の監視を開始する
window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        alert("お使いのブラウザは位置情報に対応していません。");
    }
};

// ボタン用：現在地にジャンプする関数
function jumpToCurrentLocation() {
    if (currentMarker) {
        map.setView(currentMarker.getLatLng(), 16);
    } else {
        alert("現在地を取得中です。少しお待ちください。");
    }
}
