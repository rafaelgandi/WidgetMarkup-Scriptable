// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: hourglass-half;


/*
    This is a re-implementation of the Time Progress widget using the WidgetMarkup library.
*/
const { widgetMarkup, concatMarkup } = importModule('WidgetMarkup');
const width = 125;
const h = 5;
const now = new Date();
const weekday = now.getDay() == 0 ? 6 : now.getDay() - 1;
const minutes = now.getMinutes();

function createProgress(total, havegone) {
    const context = new DrawContext()
    context.size = new Size(width, h)
    context.opaque = false
    context.respectScreenScale = true
    context.setFillColor(new Color("#48484b"))
    const path = new Path()
    path.addRoundedRect(new Rect(0, 0, width, h), 3, 2)
    context.addPath(path)
    context.fillPath()
    context.setFillColor(new Color("#ffd60a"))
    const path1 = new Path()
    path1.addRoundedRect(new Rect(0, 0, width * havegone / total, h), 3, 2)
    context.addPath(path1)
    context.fillPath()
    return context.getImage()
}

function makeRow(total, haveGone, str) {
    const styles = {
        text: {
            textColor: new Color("#e587ce"),
            font: Font.boldSystemFont(13)
        },
        image: {
            imageSize: new Size(width, h)
        }
    };
    return concatMarkup/* xml */`
        <text styles="${styles.text}">${str}</text>
        <spacer value="6" />
        <image src="${createProgress(total, haveGone)}" styles="${styles.image}"/>
        <spacer value="6" />
    `;
}

const w = await widgetMarkup/* xml */`
    <widget styles="${{ backgroundColor: new Color("#222222") }}">
        ${(() => {
            if (Device.locale() == "zh_CN") {
                return [
                    makeRow(24 * 60, (now.getHours() + 1) * 60 + minutes, "今日"),
                    makeRow(7, weekday + 1, "本周"),
                    makeRow(30, now.getDate() + 1, "本月"),
                    makeRow(12, now.getMonth() + 1, "今年")
                ].join('');
            } else {
                return [
                    makeRow(24 * 60, (now.getHours() + 1) * 60 + minutes, "Today"),
                    makeRow(7, weekday + 1, "This week"),
                    makeRow(30, now.getDate() + 1, "This month"),
                    makeRow(12, now.getMonth() + 1, "This year")
                ].join('');
            }
        })()}
    </widget>
`;

Script.setWidget(w);
Script.complete();
w.presentMedium();


