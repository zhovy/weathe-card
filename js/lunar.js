// ========== 农历计算模块（纯算法，无依赖）==========
// 1900-2100 年农历数据
const LUNAR_INFO = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, //1900-1909
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, //1910-1919
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, //1920-1929
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, //1930-1939
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, //1940-1949
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, //1950-1959
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, //1960-1969
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, //1970-1979
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, //1980-1989
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0, //1990-1999
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, //2000-2009
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, //2010-2019
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, //2020-2029
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, //2030-2039
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, //2040-2049
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0, //2050-2059
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, //2060-2069
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, //2070-2079
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, //2080-2089
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252, //2090-2099
    0x0d520                                                                               //2100
];

// ---------- 农历节日映射（农历月日 -> 节日名称）----------
const LUNAR_FESTIVALS = {
    "0101": "春节",
    "0115": "元宵节",
    "0202": "龙抬头",
    "0303": "上巳节",
    "0505": "端午节",
    "0707": "七夕节",
    "0715": "中元节",
    "0815": "中秋节",
    "0909": "重阳节",
    "1208": "腊八节",
    "1223": "小年",
    "1224": "小年",
    "1229": "除夕",
    "1230": "除夕"
};

// ---------- 辅助函数 ----------
function getLunarYearDays(year) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
    return sum + getLeapMonthDays(year);
}
function getLeapMonth(year) { return LUNAR_INFO[year - 1900] & 0xf; }
function getLeapMonthDays(year) {
    if (getLeapMonth(year)) return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
    return 0;
}
function getLunarMonthDays(year, month) {
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

// ---------- 核心：获取农历日期信息 ----------
function getLunarDateInfo(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;
    let lunarYear = 1900;
    let yearDays = 0;
    for (let i = 0; i < LUNAR_INFO.length && offset >= 0; i++) {
        yearDays = getLunarYearDays(lunarYear);
        offset -= yearDays;
        if (offset >= 0) lunarYear++;
    }
    offset += yearDays;

    let leapMonth = getLeapMonth(lunarYear);
    let isLeap = false;
    let lunarMonth = 1;
    let monthDays = 0;
    for (let i = 1; i <= 12; i++) {
        monthDays = getLunarMonthDays(lunarYear, i);
        if (leapMonth === i && !isLeap) {
            monthDays = getLeapMonthDays(lunarYear);
            isLeap = true;
            i--;
        }
        offset -= monthDays;
        if (offset < 0) break;
        lunarMonth++;
    }
    offset += monthDays;
    let lunarDay = offset + 1;

    return {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay,
        isLeap: isLeap,
        leapMonth: leapMonth
    };
}

// ---------- 数字转中文 ----------
const chineseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function numberToChineseYear(num) {
    let str = '';
    num.toString().split('').forEach(d => str += chineseNumber[parseInt(d)]);
    return str;
}

function numberToChineseMonth(month, isLeap) {
    let str = isLeap ? '闰' : '';
    if (month === 1) str += '正月';
    else if (month === 2) str += '二月';
    else if (month === 3) str += '三月';
    else if (month === 4) str += '四月';
    else if (month === 5) str += '五月';
    else if (month === 6) str += '六月';
    else if (month === 7) str += '七月';
    else if (month === 8) str += '八月';
    else if (month === 9) str += '九月';
    else if (month === 10) str += '十月';
    else if (month === 11) str += '冬月';
    else if (month === 12) str += '腊月';
    return str;
}

function numberToChineseDay(day) {
    if (day === 10) return '初十';
    if (day === 20) return '二十';
    if (day === 30) return '三十';
    let str = '';
    let shi = Math.floor(day / 10);
    if (shi === 0) str = '初';
    else if (shi === 1) str = '十';
    else if (shi === 2) str = '廿';
    else if (shi === 3) str = '卅';
    let ge = day % 10;
    if (ge !== 0) str += chineseNumber[ge];
    return str;
}

// ---------- 获取完整农历字符串（含年份）----------
function getLunarDate(date) {
    const info = getLunarDateInfo(date);
    const yearStr = numberToChineseYear(info.year);
    const monthStr = numberToChineseMonth(info.month, info.isLeap);
    const dayStr = numberToChineseDay(info.day);
    return `农历 ${yearStr}年 ${monthStr}${dayStr}`;
}

// ---------- 获取农历月日汉字（不含年份，如“正月廿六”）----------
function getLunarMonthDay(date) {
    const info = getLunarDateInfo(date);
    const monthStr = numberToChineseMonth(info.month, info.isLeap);
    const dayStr = numberToChineseDay(info.day);
    return `${monthStr}${dayStr}`;
}

// ---------- 获取农历节日（若无返回空字符串）----------
function getLunarFestival(date) {
    const info = getLunarDateInfo(date);
    if (info.isLeap) return ''; // 闰月无传统节日
    const key = `${info.month.toString().padStart(2, '0')}${info.day.toString().padStart(2, '0')}`;
    return LUNAR_FESTIVALS[key] || '';
}