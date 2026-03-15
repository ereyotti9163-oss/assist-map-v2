const map = L.map('map').setView([34.8893, 135.7003], 15);
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenCycleMap'
}).addTo(map);

let currentMarker = null;
let isFollowing = true; // 追従モードの初期値

// 位置情報の更新
function onLocationUpdate(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const latlng = L.latLng(lat, lon);

    if (currentMarker) {
        currentMarker.setLatLng(latlng);
    } else {
        currentMarker = L.circleMarker(latlng, {
            radius: 10, color: '#FFFFFF', weight: 3, fillColor: '#0078FF', fillOpacity: 1
        }).addTo(map);
    }

    if (isFollowing) {
        map.panTo(latlng);
    }
}

// 追従モードのON/OFF
function toggleFollow() {
    isFollowing = !isFollowing;
    alert(isFollowing ? "自動追従：ON" : "自動追従：OFF（地図を自由に動かせます）");
}

// 住所検索機能
document.getElementById('search-button').onclick = function() {
    const query = document.getElementById('search-input').value;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const result = data[0];
                map.setView([result.lat, result.lon], 15);
                isFollowing = false; // 検索した場所を見たいので追従は一旦OFF
            } else {
                alert("場所が見つかりませんでした");
            }
        });
};

// 監視開始
navigator.geolocation.watchPosition(onLocationUpdate, (err) => console.error(err), {
    enableHighAccuracy: true
});
