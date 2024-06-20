function popupFlow(target) {
    document.querySelector(target).style.display = "block";
    NavSet(0, "none")
}

function popupClose(target) {
    document.querySelector(target).style.display = "none";
}

function NavSet(widthy, hd) {
    document.querySelector("#sidemenu").style.width = widthy+"px";
    document.querySelector("#mapping").style.right = widthy+"px";
    document.querySelector(".asan-btn-menu").style.display = hd;
}

function spread(name) {
    var status = document.querySelector(name).style.display
    if (status != "block") {
        document.querySelector(name+"-static").innerHTML = '<i style="font-size: 16px;" class="bi bi-caret-up-fill"></i>';
        document.querySelector(name).style.display = "block";
    } else {
        document.querySelector(name+"-static").innerHTML = '<i style="font-size: 16px;" class="bi bi-caret-down-fill"></i>';
        document.querySelector(name).style.display = "none";
    }
}

function DustRate(grade) {
    if (grade == 1) {
        return "좋음";
    }
    if (grade == 2) {
        return "보통";
    }
    if (grade == 3) {
        return "나쁨";
    }
    if (grade == 4) {
        return "매우 나쁨";
    }
}