// ---------- 天气代码映射 ----------
function getWeatherInfo(code) {
    if (code === 0) return { desc: "晴朗", icon: "☀️" };
    if (code === 1) return { desc: "大部晴", icon: "🌤️" };
    if (code === 2) return { desc: "多云", icon: "⛅" };
    if (code === 3) return { desc: "阴天", icon: "☁️" };
    if ([45,48].includes(code)) return { desc: "雾", icon: "🌫️" };
    if ([51,53,55].includes(code)) return { desc: "毛毛雨", icon: "🌧️" };
    if ([56,57].includes(code)) return { desc: "冻雨", icon: "🌨️" };
    if ([61,63,65].includes(code)) return { desc: "雨", icon: "🌧️" };
    if ([66,67].includes(code)) return { desc: "冻雨", icon: "🌨️" };
    if ([71,73,75].includes(code)) return { desc: "雪", icon: "❄️" };
    if (code===77) return { desc: "冰粒", icon: "❄️" };
    if ([80,81,82].includes(code)) return { desc: "阵雨", icon: "🌦️" };
    if ([85,86].includes(code)) return { desc: "阵雪", icon: "🌨️" };
    if (code===95) return { desc: "雷雨", icon: "⛈️" };
    if ([96,99].includes(code)) return { desc: "强雷雨", icon: "⛈️" };
    return { desc: "其他", icon: "🌡️" };
}

// ---------- 紫外线等级 ----------
function getUvLevel(uv) {
    if (uv < 0) return "--";
    if (uv <= 2) return "低";
    if (uv <= 5) return "中";
    if (uv <= 7) return "高";
    if (uv <= 10) return "很高";
    return "极高";
}

// ---------- 生成今日实时建议 ----------
function generateTodayAdvice(temp, wcode, hum, wind, uv, feel, precip, cloud) {
    let arr = [];
    if (temp >= 32) arr.push("🔥高温防暑");
    else if (temp >= 28) arr.push("☀️较热防晒");
    else if (temp <= 0) arr.push("❄️严寒保暖");
    else if (temp <= 8) arr.push("🍂偏冷添衣");

    const rain = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99];
    const snow = [71,73,75,77,85,86];
    if (rain.includes(wcode)) arr.push("🌂有雨带伞");
    else if (snow.includes(wcode)) arr.push("☃️雪天防滑");

    if (precip >= 60) arr.push("☔降水概率高");
    else if (precip >= 30) arr.push("🌂可能降雨");

    if (wind >= 35) arr.push("💨强风");
    else if (wind >= 25) arr.push("🍃风较大");

    if (hum >= 85) arr.push("💧湿度高");
    else if (hum <= 25) arr.push("🌵干燥多水");

    if (uv >= 8) arr.push("☀️紫外线极强");
    else if (uv >= 5) arr.push("🧴紫外线中等");

    if (cloud >= 80) arr.push("☁️云量多");

    if (arr.length === 0) arr.push("🌿天气舒适");
    return arr.slice(0, 2).join(" · ");
}

// ---------- 生成每日独立建议（未来天）---------
function generateDailyAdvice(code, max, min, precip, uvMax, windMax) {
    let t = [];
    if (max >= 35) t.push("🔥酷暑");
    else if (max >= 30) t.push("☀️炎热");
    else if (max <= 0) t.push("❄️严寒");
    else if (min <= 5) t.push("🌙夜冷");

    const rain = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99];
    const snow = [71,73,75,77,85,86];
    if (rain.includes(code)) t.push("🌧️带伞");
    else if (snow.includes(code)) t.push("☃️防滑");

    if (precip >= 60) t.push("☔大雨概率");
    else if (precip >= 30) t.push("🌦️小雨可能");

    if (windMax >= 40) t.push("💨强风");
    if (uvMax >= 8) t.push("☀️严防晒");

    if (t.length === 0) {
        if (code === 0 || code === 1) t.push("😎宜户外");
        else t.push("🍃舒适");
    }
    return t.slice(0, 2).join(" ");
}

// ---------- 格式化星期 ----------
function getWeekday(dateStr) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const d = new Date(dateStr + 'T12:00:00');
    return days[d.getDay()];
}

// ---------- 格式化当前时间（头部用）---------
function formatTime() {
    const n = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[n.getDay()];
    return `${weekday} ${n.getHours().toString().padStart(2, '0')}:${n.getMinutes().toString().padStart(2, '0')}`;
}

// ---------- 数值保留一位小数 ----------
function formatOneDecimal(v) {
    if (v === undefined || v === null || isNaN(v)) return '--';
    return v.toFixed(1);
}
// ---------- 公历节气（近似，覆盖主要节气）----------
function getSolarTerm(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (month === 2 && (day === 3 || day === 4 || day === 5)) return "立春";
    if (month === 3 && (day === 5 || day === 6 || day === 7)) return "惊蛰";
    if (month === 3 && (day === 20 || day === 21)) return "春分";
    if (month === 4 && (day === 4 || day === 5 || day === 6)) return "清明";
    if (month === 4 && (day === 19 || day === 20 || day === 21)) return "谷雨";
    if (month === 5 && (day === 5 || day === 6 || day === 7)) return "立夏";
    if (month === 5 && (day === 20 || day === 21)) return "小满";
    if (month === 6 && (day === 5 || day === 6 || day === 7)) return "芒种";
    if (month === 6 && (day === 21 || day === 22)) return "夏至";
    if (month === 7 && (day === 6 || day === 7 || day === 8)) return "小暑";
    if (month === 7 && (day === 22 || day === 23 || day === 24)) return "大暑";
    if (month === 8 && (day === 7 || day === 8 || day === 9)) return "立秋";
    if (month === 8 && (day === 22 || day === 23 || day === 24)) return "处暑";
    if (month === 9 && (day === 7 || day === 8 || day === 9)) return "白露";
    if (month === 9 && (day === 22 || day === 23 || day === 24)) return "秋分";
    if (month === 10 && (day === 8 || day === 9 || day === 10)) return "寒露";
    if (month === 10 && (day === 23 || day === 24 || day === 25)) return "霜降";
    if (month === 11 && (day === 7 || day === 8 || day === 9)) return "立冬";
    if (month === 11 && (day === 22 || day === 23 || day === 24)) return "小雪";
    if (month === 12 && (day === 6 || day === 7 || day === 8)) return "大雪";
    if (month === 12 && (day === 21 || day === 22 || day === 23)) return "冬至";
    if (month === 1 && (day === 5 || day === 6 || day === 7)) return "小寒";
    if (month === 1 && (day === 19 || day === 20 || day === 21)) return "大寒";
    return null;
}