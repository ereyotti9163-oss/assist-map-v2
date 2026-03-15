// 1. 地図の土台を作成（八幡市周辺を表示）
const map = L.map('map').setView([34.8893, 135.7003], 15);

// 2. サイクリング専用地図（CyclOSM）を表示
// キー不要で、自転車道が青色などで強調されます
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenCycleMap contributors'
}).addTo(map);

// 3. 現在地ジャンプ関数
function jumpToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                map.setView([lat, lon], 16);
            },
            () => {
                alert("位置情報が取得できません。八幡市を表示します。");
                map.setView([34.8893, 135.7003], 15);
            },
            { enableHighAccuracy: true }
        );
    }
}
