const xy = [36.79, 127];
const nobrand = "Hello, world!";

const map = new L.map('map').setView(xy, 11);

var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Rawris API &copy; <a target="_blank" href="https://rawris.ekr.or.kr/">KRC.</a>'
});

map.addLayer(layer);

var marker2 = L.marker([37.55504, 126.92064]);
marker2.on("click",function () {
    alert(nobrand);
}).addTo(map);