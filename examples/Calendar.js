// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: calendar-alt;



// Inspired by WidgetCal app 😁



////////////////////////////////////////////////////////////////////////////////////
// {</>} WidgetMarkup - Simple implementation of markup for Scriptable iOS widgets.
// COPY THIS SCRIPT TO YOUR WIDGET FILE.
////////////////////////////////////////////////////////////////////////////////////
// Version 0.20210912a
const WidgetMarkup=(()=>{function t(t){if(t&&t.constructor&&t.constructor.toString){let e=t.constructor.toString().match(/function\s*(\w+)/);if(e&&2==e.length)return e[1]}}function e(e,n){return Object.keys(n).forEach(r=>{if(-1!==r.indexOf("*")){if(!((r=r.replace("*",""))in e))throw new Error(`Method "${r}()" is not applicable to instance of ${t(e)}`);Array.isArray(n["*"+r])?e[r](...n["*"+r]):e[r](n[r])}else{if(!(r in e))throw new Error(`Property "${r}" is not applicable to instance of ${t(e)}`);e[r]=n[r]}}),e}function n(t=[],e="styles"){let n={};return t.forEach(t=>{t.name.toLowerCase()===e.toLowerCase()&&(n=void 0!==r[t.value]?r[t.value]:t.value)}),n}const r={};function a(t,e){let n="";return t.forEach((t,a)=>{if(e[a])if(Array.isArray(e[a])&&(e[a]=e[a].join("")),"string"==typeof e[a])n+=t+e[a];else{let o="$$["+UUID.string()+Math.floor(20*Math.random())+"]";r[o]=e[a],n+=t+o}else n+=t}),n}return{widgetMarkup:async function(t,...o){let i=a(t,o);const l=(await async function(t){const e=new WebView;await e.loadHTML("<html></html>"),console.log(t);const n=`\n        var getAttributes = function (attributes) {\n            return Array.prototype.map.call(attributes, function (attribute) {\n                return {\n                    name: attribute.name,\n                    value: attribute.value\n                };\n            });\n        };\n        \n        var createDOMMap = function (element) {\n            return Array.prototype.map.call(element.childNodes, (function (node) {\n                if (node.nodeType !== 3 && node.nodeType !== 8) {\n                    var details = {\n                        tag: node.tagName.toLowerCase(),\n                        textContent: node.textContent,\n                        attributes: node.nodeType !== 1 ? [] : getAttributes(node.attributes)\n                    };\n                    details.children = createDOMMap(node);\n                    return details;\n                }\n                return null;\n            })).filter((e) => e !== null);\n        };\n        \n        function getDom() {\n            let htmlStr = '${t=`<tabom>${t=function(t){return(t=t.replace(/(\r\n|\n|\r)/gm,"")).replace(/<\s*text[^>]*>(.*?)<\s*\/\s*text>/gi,(t,e)=>t.replace(e,function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}(e)))}(t)}</tabom>`}';\n            const dom = new DOMParser();\n            let doc = dom.parseFromString(htmlStr, 'application/xml');\n            return JSON.stringify(createDOMMap(doc.documentElement));\n        }\n        try {\n            completion(getDom());\n        }\n        catch (err) {\n            completion([{\n                tag: 'error',\n                textContent: err.message\n            }]);\n        }    \n      `;let r=await e.evaluateJavaScript(n,!0);const a=JSON.parse(r);if(a.length&&-1!==a[0].tag.toLocaleLowerCase().indexOf("error"))throw new Error(a[0].textContent);return a}(i))[0];if(void 0===l)throw new Error("WidgetMarkup requires that the <widget> element be the parent element of your widget.");const c=l.children,s=new ListWidget;return e(s,n(l.attributes,"styles")),function t(a,o){return o.forEach(o=>{if("text"===o.tag){const t=/(\$\$\[.+\])/gi;t.test(o.textContent)&&(o.textContent=o.textContent.replace(t,(t,e)=>r[e].toString())),e(a.addText(function(t){return t.replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&")}(o.textContent)),n(o.attributes,"styles"))}else if("spacer"===o.tag){let t=parseInt(n(o.attributes,"value"),10);t<1||isNaN(t)?a.addSpacer():a.addSpacer(t)}else if("image"===o.tag)e(a.addImage(n(o.attributes,"src")),n(o.attributes,"styles"));else if("date"===o.tag)e(a.addDate(n(o.attributes,"value")),n(o.attributes,"styles"));else if("stack"===o.tag){let r=a.addStack();e(r,n(o.attributes,"styles")),t(r,o.children)}}),a}(s,c),s},concatMarkup:function(t,...e){return a(t,e)}}})();
const { widgetMarkup, concatMarkup } = WidgetMarkup;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const today = new Date();
function generateCalendar(d = new Date()) {
    Date.prototype.monthDays = function () {
        let dd = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return dd.getDate();
    };
    var details = {
        totalDays: d.monthDays(),
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: MONTHS,
    };
    var start = new Date(d.getFullYear(), d.getMonth()).getDay();
    var cal = [];
    var day = 1;
    for (var i = 0; i <= 5; i++) {
        cal[i] = [];
        for (var j = 0; j < 7; j++) {
            if (i === 0) {
                cal[i].push({
                    weekLabel: details.weekDays[j]
                });
            } 
            else if (day > details.totalDays) {
                cal[i].push(null);
            } 
            else {
                if (i === 1 && j < start) {
                    cal[i].push(null);
                } 
                else {
                    let dateNum = (day++);
                    let dateInstance = new Date(d.getFullYear(), d.getMonth(), dateNum);
                    cal[i].push({
                        date: dateNum,
                        day: details.weekDays[j],
                        dateInstance,
                        month: details.months[dateInstance.getMonth()],
                        year: dateInstance.getFullYear()
                    });
                }
            }
        }
    }
    return cal;
}

function ymd(date) {
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    return `${y}-${m}-${d}`;
}

async function getEvents() {
    let start = new Date(today.getFullYear(), today.getMonth(), 1);
    let end  = new Date(today.getFullYear(), (today.getMonth() + 1), 1);
    let events = await CalendarEvent.between(start, end);
    let normalized = {};
    events.forEach((e) => {
        let key = ymd(e.startDate);
        if (!normalized?.[key]) {
            normalized[key] = [];
        }
        normalized[key].push(e);
    });
    //console.log(normalized);
    return normalized;
}

const events = await getEvents();
const attr = {
    con: {
        url: 'calshow://',
        '*setPadding': [0,0,0,0],
        spacing: 0,
//         refreshAfterDate: new Date((new Date()).getTime() + (15 * 60000)) // Refresh after 15min
    },
    dateText: {
        font: new Font('PingFangSC-Light', 10),
        textColor: Color.white()
    },
    row: {
        '*layoutHorizontally': null
    },
    weekTextLabels: {
        font: new Font('ArialRoundedMTBold', 10),
    },
    cell: {
        '*layoutVertically': null,
        borderWidth: 1,
        borderColor: new Color('#333333'),
        '*setPadding': [2,3,0,0],
        size: new Size(45, 55)
    },
    todayCell: {
        borderColor: new Color('#46C35B'),
    },
    sundayRed: {
        textColor: new Color('#FF5D4D')
    },
    saturdayLabel: {
        textColor: new Color('#00A6EE')
    },
    weekCellStack: {
        '*layoutHorizontally': null,
        size: new Size(45, 20),
        borderWidth: 0,
    },
    eventsListStack: {
        '*setPadding': [5,0,0,0],
        '*layoutVertically': null,
        size: new Size(45, 30),
    },
    eventText: {
        font: new Font('PingFangSC-Light', 10),
        textColor: new Color('#FCB841'),
        lineLimit: 1
    },
    oldEventText: {
        textOpacity: 0.5
    },
    eventStack: {
        '*setPadding': [0,0,0,0],
        '*layoutVertically': null
    },
    monthYearLabelStack: {
        '*setPadding': [5,3,3,3],
        '*layoutHorizontally': null
    },
    monthYearLabelText: {
        font: new Font('ArialRoundedMTBold', 15),
    }
};

function createCalendarMarkUp() {
    let days = generateCalendar();
    let body = '';
    days.forEach((row, ri) => {
        body += concatMarkup /* xml */ `<stack styles="${attr.row}">`;
        row.forEach((cell) => {
            if (ri === 0) { // print week labels
                let labelAttrs = attr.weekTextLabels;
                if (cell.weekLabel.toLowerCase() === 'sun') {
                    labelAttrs = {...attr.weekTextLabels, ...attr.sundayRed};
                }
                else if (cell.weekLabel.toLowerCase() === 'sat') {
                    labelAttrs = {...attr.weekTextLabels, ...attr.saturdayLabel};
                }
                body += concatMarkup /* xml */ `    
                <stack styles="${{...attr.cell, ...attr.weekCellStack}}">
                    <spacer/>
                    <text styles="${labelAttrs}">${cell.weekLabel}</text>
                    <spacer/>
                </stack>
                `;
            }
            else {
                if (cell === null) {
                    body += concatMarkup /* xml */ `
                    <stack styles="${attr.cell}">
                        <text styles="${attr.dateText}"> </text>
                    </stack>`;
                }
                else {
                    let dateAttrs = attr.dateText;
                    let cellAttrs = attr.cell;
                    if (cell.day.toLowerCase() === 'sun') {
                        dateAttrs = {...attr.dateText, ...attr.sundayRed};
                    }
                    else if (cell.day.toLowerCase() === 'sat') {
                        dateAttrs = {...attr.dateText, ...attr.saturdayLabel};
                    }
                    if (ymd(today) === ymd(cell.dateInstance)) {
                        cellAttrs = {...attr.cell, ...attr.todayCell}
                    }
                    body += concatMarkup /* xml */ `
                    <stack styles="${cellAttrs}">
                        <text styles="${dateAttrs}">${cell.date.toString()}</text>
                        <stack styles="${attr.eventsListStack}">
                            ${(() => {
                                let eventsMarkup = '';
                                let key = ymd(cell.dateInstance);
                                if (events?.[key]) {
                                    events[key].forEach((e) => {
                                        let eventTextAttr = attr.eventText;
                                        if (cell.dateInstance.getTime() < today.getTime() && ymd(cell.dateInstance) !== ymd(today)) {
                                            eventTextAttr = {...attr.eventText, ...attr.oldEventText};
                                        }
                                        eventsMarkup += concatMarkup /* xml */ `
                                            <stack styles="${attr.eventStack}">
                                                <text styles="${eventTextAttr}">${e.title}</text>
                                            </stack>
                                        `;
                                    });
                                    return eventsMarkup;
                                }
                                else {
                                    return '';
                                }
                            })()}
                        </stack>
                    </stack>`;
                }
            }
        });
        body += concatMarkup /* xml */ `</stack>`;
    });
    return body;
}

const widget = await widgetMarkup/* xml */`
    <widget styles="${attr.con}">
        ${createCalendarMarkUp()}
        <stack styles="${attr.monthYearLabelStack}">          
            <text styles="${attr.monthYearLabelText}">🧑🏽‍🚀${MONTHS[today.getMonth()]} ${today.getFullYear().toString()}🪐</text>
        </stack>
    </widget>
`;



// Check where the script is running
if (config.runsInWidget) {
    // Runs inside a widget so add it to the homescreen widget
    Script.setWidget(widget);
}
else {
    // Show the medium widget inside the app
    widget.presentLarge();
}
Script.complete();