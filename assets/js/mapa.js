<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

document.addEventListener('DOMContentLoaded', () => {

    const fatecMogiMirim = [-22.4223031891046, -46.949371420697496];

    const map = L.map('map', { scrollWheelZoom: false }).setView(fatecMogiMirim, 17);


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);


    L.marker(fatecMogiMirim).addTo(map)
        .bindPopup('<b>Fatec "Arthur de Azevedo" de Mogi Mirim</b>')
        .openPopup();
});
