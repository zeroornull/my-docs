---
title: moment.js插件
---


```javascript
moment().format();                                // "2014-09-08T08:02:17-05:00" (ISO 8601，无小数秒钟)
moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
moment().format("ddd, hA");                       // "Sun, 3PM"
moment('gibberish').format('YYYY MM DD');         // "Invalid date"

//日期格式化
moment().format('MMMM Do YYYY, h:mm:ss a'); // 十二月 8日 2020, 5:27:04 下午
moment().format('dddd');                    // 星期二
moment().format("MMM Do YY");               // 12月 8日 20
moment().format('YYYY [escaped] YYYY');     // 2020 escaped 2020
moment().format();                          // 2020-12-08T17:27:04+08:00
//相对时间
moment("20111031", "YYYYMMDD").fromNow(); // 9 年前
moment("20120620", "YYYYMMDD").fromNow(); // 8 年前
moment().startOf('day').fromNow();        // 17 小时前
moment().endOf('day').fromNow();          // 7 小时内
moment().startOf('hour').fromNow();       // 27 分钟前
//日历时间
moment().subtract(10, 'days').calendar(); // 2020/11/28
moment().subtract(6, 'days').calendar();  // 上星期三17:27
moment().subtract(3, 'days').calendar();  // 上星期六17:27
moment().subtract(1, 'days').calendar();  // 昨天17:27
moment().calendar();                      // 今天17:27
moment().add(1, 'days').calendar();       // 明天17:27
moment().add(3, 'days').calendar();       // 下星期五17:27
moment().add(10, 'days').calendar();      // 2020/12/18
//多语言支持
moment.locale();         // zh-cn
moment().format('LT');   // 17:27
moment().format('LTS');  // 17:27:04
moment().format('L');    // 2020/12/08
moment().format('l');    // 2020/12/8
moment().format('LL');   // 2020年12月8日
moment().format('ll');   // 2020年12月8日
moment().format('LLL');  // 2020年12月8日下午5点27分
moment().format('lll');  // 2020年12月8日 17:27
moment().format('LLLL'); // 2020年12月8日星期二下午5点27分
moment().format('llll'); // 2020年12月8日星期二 17:27

```