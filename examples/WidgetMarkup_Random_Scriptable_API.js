// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: book;
// This script shows a random Scriptable API in a widget. The script is meant to be used with a widget configured on the Home Screen.
// You can run the script in the app to preview the widget or you can go to the Home Screen, add a new Scriptable widget and configure the widget to run this script.
// You can also try creating a shortcut that runs this script. Running the shortcut will show widget.

/*
    This is a re-implementation of the Random Scriptable API widget using the WidgetMarkup library.
*/
const {widgetMarkup, concatMarkup} = importModule('WidgetMarkup');

async function randomAPI() {
    let docs = await loadDocs()
    let apiNames = Object.keys(docs)
    let num = Math.round(Math.random() * apiNames.length)
    let apiName = apiNames[num]
    let api = docs[apiName]
    return {
        name: apiName,
        description: api["!doc"],
        url: api["!url"]
    }
}

async function loadDocs() {
    let url = "https://docs.scriptable.app/scriptable.json"
    let req = new Request(url)
    return await req.loadJSON()
}

async function loadAppIcon() {
    let url = "https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/21/1e/13/211e13de-2e74-4221-f7db-d6d2c53b4323/AppIcon-1x_U007emarketing-0-7-0-85-220.png/540x540sr.jpg"
    let req = new Request(url)
    return req.loadImage()
}

async function createWidget(api) {
    let appIcon = await loadAppIcon()
    let title = "Random Scriptable API"
    // Add background gradient
    let gradient = new LinearGradient()
    gradient.locations = [0, 1]
    gradient.colors = [
        new Color("141414"),
        new Color("13233F")
    ]
    const styles = {
        widget: {
            backgroundGradient: gradient
        },
        appIconImage: {
            imageSize: new Size(15, 15),
            cornerRadius: 4
        },
        titleText: {
            textColor: Color.white(),
            textOpacity: 0.7,
            font: Font.mediumSystemFont(13)
        },
        nameText: {
            textColor: Color.white(),
            font: Font.boldSystemFont(18)
        },
        descriptionText: {
            minimumScaleFactor: 0.5,
            textColor: Color.white(),
            font: Font.systemFont(18)
        },
        linkStack: {
            '*centerAlignContent': null,
            url: api.url
        },
        linkText: {
            font: Font.mediumSystemFont(13),
            textColor: Color.blue()
        },
        linkImage: {
            imageSize: new Size(11, 11),
            tintColor: Color.blue()
        },
        docsImage: {
            imageSize: new Size(20, 20),
            tintColor: Color.white(),
            imageOpacity: 0.5,
            url: "https://docs.scriptable.app"
        }
    };

    const widget = await widgetMarkup`
    <widget styles="${styles.widget}">
        <stack id="titleStack">
            <image src="${appIcon}" styles="${styles.appIconImage}" />
            <spacer value="4" />
            <text styles="${styles.titleText}">${title}</text>
        </stack>
        <spacer value="12" />
        <text styles="${styles.nameText}">${api.name}</text>
        <spacer value="2" />
        <text styles="${styles.descriptionText}">${api.description}</text>
        ${(() => {
            if (!config.runsWithSiri) {
                let linkSymbol = SFSymbol.named("arrow.up.forward");
                let docsSymbol = SFSymbol.named("book");
                return concatMarkup`
                    <spacer value="8" />
                    <stack id="footerStack">
                        <stack styles="${styles.linkStack}">
                            <text styles="${styles.linkText}">Read more</text>
                            <spacer value="3" />
                            <image src="${linkSymbol.image}" styles="${styles.linkImage}" />
                        </stack>
                        <spacer />
                        <image src="${docsSymbol.image}" styles="${styles.docsImage}" />
                    </stack>
                `;
            }
            else { return ''; }
        })()}
    </widget>
    `;
    return widget
}

let api = await randomAPI()
let widget = await createWidget(api)
if (config.runsInWidget) {
    // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
    Script.setWidget(widget)
} else {
    // The script runs inside the app, so we preview the widget.
    widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()
