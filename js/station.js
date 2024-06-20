function selected(sta) {
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    $(".leaflet-marker-shadow").remove();
    cmdr(sta);
}

const key = "08b333fbb27d18a08dc1";
const header = {headers: {"Authentication": key}};

function cmdr (station) {
    axios.post("/api/reservoir/list/"+station, {}, header).then(r => {
        for (let index = 0; index < 18; index++) {

            const dex = r.data.body[index];

            var iconT = L.icon({
                iconUrl: '/icons/droplet-half.png',
                shadowUrl: '/icons/droplet-fill.png',
                iconSize: [32, 32],
                shadowSize: [40, 40]
            });
            
            var checkpoint = L.marker([dex.lat, dex.lon], {icon: iconT});

            checkpoint.addTo(map);
            
            checkpoint.on("click", function() {
                axios.post("/api/reservoir/detail/"+dex.no, {}, header).then(t => {
                    Weather(dex.jurisdiction);
                    setTimeout(() => {
                        chartWater(t.data.body);
                    }, 1000);

                    map.flyTo([dex.lat+0.002, dex.lon], 16);
                    this.bindPopup ("<h6>"+dex.resername+"저수지</h6>"+
                                    "<b>전일정보</b> - "+datestring(t.data.body.daily[6].date)+"<br>저수율 : "+t.data.body.daily[6].rate+" %<br>저수지 수위 : "+t.data.body.daily[6].wlevel+" EL.m<br>"+
                                    "<br><b>금일정보</b> - "+datestring(t.data.body.daily[7].date)+"<br>저수율 : "+t.data.body.daily[7].rate+" %<br>저수지 수위 : "+t.data.body.daily[7].wlevel+" EL.m<br>"+
                                    '<canvas id="waterchat">Chat Loading...</canvas>'
                    , {
                        maxWidth: 400
                    }).openPopup();
                });
            });
        }
    });
}

function chartWater(dat) {
    let fordate = [];
    let forwlevel = [];
    let forrate = [];

    for (let i = 0; i < 8; i++) {
        fordate.push(daystring(dat.daily[i].date));
        forwlevel.push(dat.daily[i].wlevel);
        forrate.push(dat.daily[i].rate);
    }

    const weatherchat = {
        labels: fordate,
        datasets:
        [
            {
                label: "저수지 수위",
                data: forwlevel,
                borderColor: "#ff7800",
                backgroundColor: "#ff7800",
            },
            {
                label: "저수율",
                data: forrate,
                borderColor: "#0d6826",
                backgroundColor: "#0d6826",
            }
        ]};

        new Chart(document.querySelector("#waterchat"), {
        type: 'line',
        data: weatherchat,
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 0
                }
            }
        }
    });
}

function daystring(dates) {
    const days = dates.substring(6,8);

    return days+"일";
}

function datestring(dates) {
    const year = dates.substring(0,4);
    const month = dates.substring(4,6);
    const days = dates.substring(6,8);

    return year+"."+month+"."+days;
}

function Weather(location) {
    const json = axios.post("/api/weather/current/"+location, {}, header);

    json.then(ras => {
        const w = ras.data.body.weather.current;
        const t = ras.data.body.weather.daily[1];
        const d = ras.data.body.dust;
        document.querySelector(".weather").innerHTML = WeatherReturn(w.weather[0].icon)+" | "+ceil(w.temp)+"℃"+' <span class="weather-side-static"><i class="bi bi-caret-down-fill" style="font-size: 16px;"></i></span>';
        document.querySelector(".weather-side").innerHTML = "<b style='font-size: 24px;'>내일의 날씨</b><br>"+
                                                            "<span style='font-size: 42px;'>"+WeatherReturn(t.weather[0].icon)+" | </span><span style='font-size: 36px;'>"+ceil(t.temp.day)+"℃</span><br>"+
                                                            "<b style='font-size: 24px;'>미세먼지 정보</b><br>"+
                                                            "측정소 : "+d.name+"<br>"+
                                                            "미세먼지 : "+d.pm10v +" ("+ DustRate(d.pm10g)+")<br>"+
                                                            "초미세먼지 : "+d.pm25v +" ("+ DustRate(d.pm25g)+")<br>"
    });
}

function ceil(mas) {
    return mas.toFixed(0);
}

function WeatherReturn (icon) {
    if (icon == "01d") {
        return '<i class="bi bi-brightness-high"></i>';
    }
    if (icon == "01n") {
        return '<i class="bi bi-moon"></i>';
    }
    if (icon == "02d" || icon == "04d") {
        return '<i class="bi bi-cloud-sun"></i>';
    }
    if (icon == "02n" || icon == "04n") {
        return '<i class="bi bi-cloud-moon"></i>';
    }
    if (icon == "03d" || icon == "03n") {
        return '<i class="bi bi-cloud"></i>';
    }
    if (icon == "09d" || icon == "09n") {
        return '<i class="bi bi-cloud-rain-heavy"></i>';
    }
    if (icon == "10d" || icon == "10n") {
        return '<i class="bi bi-cloud-rain"></i>';
    }
    if (icon == "11d" || icon == "11n") {
        return '<i class="bi bi-cloud-lightning-rain"></i>';
    }
    if (icon == "13d" || icon == "13n") {
        return '<i class="bi bi-snow3"></i>';
    }
    if (icon == "50d" || icon == "50n") {
        return '<i class="bi bi-cloud-fog"></i>';
    }
}

cmdr("all");
Weather("온천동");