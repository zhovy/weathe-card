// ---------- Open-Meteo API URL 构建 ----------
function getApiUrl(lat, lon) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,cloud_cover,pressure_msl,visibility,dewpoint_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=Asia/Shanghai&wind_speed_unit=kmh&forecast_days=7`;
}

// ---------- 获取天气数据（返回Promise）---------
async function fetchWeatherData(lat, lon) {
    const url = getApiUrl(lat, lon);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}