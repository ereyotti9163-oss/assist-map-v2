// 1. 地図の土台を作成
const map = L.map('map').setView([34.8893, 135.7003], 15);

// 2. サイクリング専用地図を表示
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenCycleMap contributors'
}).addTo(map);

// 3. 現在地を示すマーク（青い丸）の変数
let currentMarker = null;

// 4. 位置情報を監視してマークを更新する関数
function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                // すでにマークがある場合は移動させ、なければ新しく作る
                if (currentMarker) {
                    currentMarker.setLatLng([lat, lon]);
                } else {
                    currentMarker = L.circleMarker([lat, lon], {
                        radius: 8,
                        color: '#FFFFFF',
                        weight: 2,
                        fillColor: '#0078FF',
                        fillOpacity: 1
                    }).addTo(map);
                }
            },
            () => {
                console.log("位置情報の取得に失敗しました");
            },
            { enableHighAccuracy: true }
        );
    }
}

// 起動時に監視を開始
updateLocation();

// ボタンを押した時に現在地へジャンプする機能
function jumpToCurrentLocation() {
    if (currentMarker) {
        map.setView(currentMarker.getLatLng(), 16);
    }
}
