// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: calendar-alt;
/*
 * This is the offical Scriptable widget for Indie Dev Monday
 * 
 * Indie Dev Monday (https://indiedevmonday.com) is a weekly newsletter
 * spotlighting indie developers
 * 
 * This script includes:
 * 
 * Latest issue widget (no parameter)
 * - shows latest issue
 * - works in small, medium, and large
 * - tapping opens latest issues
 * 
 * Random indie dev widget ("indie" has text parameter)
 * - shows a random indie that has already been spotlighted
 * - tapping opens that indie's issue
 * 
 */

/*
    This is a re-implementation of the Indie Dev Monday widget using the WidgetMarkup library.
*/
const { widgetMarkup, concatMarkup } = importModule('WidgetMarkup');


let indies = await loadIndies()
let issues = (await loadIssues())["items"]

let widget = null
if (config.runsInWidget) {
    if (config.widgetFamily == "small") {
        widget = await createSmallWidget(indies, issues)
    } else {
        widget = await createMediumWidget(indies, issues)
    }
    Script.setWidget(widget)
    Script.complete()
} else if (config.runsWithSiri) {
    let widget = await createMediumWidget(indies, issues)
    await widget.presentMedium()
    Script.complete()
} else {
    await presentMenu(indies, issues)
}

async function presentMenu(indies, issues) {
    let alert = new Alert()
    alert.title = issues[0].title
    alert.message =
        alert.addAction("View Small Widget")
    alert.addAction("View Medium Widget")
    alert.addAction("View Large Widget")
    alert.addAction("Open Website")
    alert.addCancelAction("Cancel")
    let idx = await alert.presentSheet()
    if (idx == 0) {
        let widget = await createSmallWidget(indies, issues)
        await widget.presentSmall()
    } else if (idx == 1) {
        let widget = await createMediumWidget(indies, issues)
        await widget.presentMedium()
    } else if (idx == 2) {
        let widget = await createMediumWidget(indies, issues)
        await widget.presentLarge()
    } else if (idx == 3) {
        Safari.open(issues[0].url)
    }
}

async function createSmallWidget(indies, issues) {
    let style = args.widgetParameter
    if (style === "indie") {
        return createSmallWidgetIndie(indies, issues)
    } else {
        return createSmallWidgetIssue(indies, issues)
    }
}

async function createSmallWidgetIndie(indies, issues) {
    let indie = indies[Math.floor(Math.random() * indies.length)];
    let urlSlug = "https://indiedevmonday.com/assets/images/indies/" + indie.slug + ".png";
    let img = await loadImage(urlSlug);
    const styles = {
        widgetCon: {
            backgroundColor: new Color("#ac3929"),
            url: "https://indiedevmonday.com/issue-" + indie.issue,
            refreshAfterDate: new Date(Date.now() + (3600 * 4 * 1000)), // i think 4 hours
            '*setPadding': [10, 10, 10, 10]
        },
        image: {
            '*centerAlignImage': null
        },
        text: {
            font: Font.lightRoundedSystemFont(10),
            textColor: Color.white(),
            lineLimit: 1,
            '*centerAlignText': null,
            minimumScaleFactor: 0.2
        }
    };
    const w = await widgetMarkup/* xml */`
        <widget styles="${styles.widgetCon}">
            <spacer value="8" />
            <image src="${img}" styles="${styles.image}" />
            <spacer />
            <text styles="${styles.text}">Indie Dev Monday</text>
        </widget>
    `;
    return w
}

async function createSmallWidgetIssue(indies, issues) {
    // Indie and issue data
    let indie = indies[0]
    let issue = issues[0]

    let title = issue.title

    let issueNumber = issue.url.split('-')[1]
    let indiesInIssue = indies.filter(function (indie) {
        return indie.issue === issueNumber
    })
    let indieNames = indiesInIssue.map(function (indie) {
        return indie.name
    })
    title = indieNames.slice(0, -1).join(',') + ' and ' + indieNames.slice(-1);

    let imglogo = await loadLogo();
    const styles = {
        widgetCon: {
            backgroundColor: new Color("#ac3929"),
            url: "https://indiedevmonday.com/issue-" + indie.issue,
            '*setPadding': [15, 15, 15, 15]
        },
        hstack: {
            '*layoutHorizontally': null,
            '*bottomAlignContent': null
        },
        hstackText: {
            font: Font.lightRoundedSystemFont(18),
            textColor: Color.white(),
            lineLimit: 2,
            '*centerAlignText': null,
            minimumScaleFactor: 0.2
        },
        imglogo: {
            imageSize: new Size(30, 30),
            cornerRadius: 12
        },
        wTitle: {
            font: Font.boldRoundedSystemFont(22),
            lineLimit: 2
        },
        date: {
            font: Font.lightRoundedSystemFont(14)
        }
    };
    const w = await widgetMarkup/* xml */`
        <widget styles="${styles.widgetCon}">
            <stack styles="${styles.hstack}">
                <text styles="${styles.hstackText}">${"#" + issueNumber}</text>
                <spacer />
                <image src="${imglogo}" styles="${styles.imglogo}" />
            </stack>
            <spacer value="8" />
            <text styles="${styles.wTitle}">${title}</text>
            <spacer />
            <date value="${getIssueDate(issue)}" styles="${styles.date}" />
        </widget>
    `;
    return w
}

async function createMediumWidget(indies, issues) {
    // Indie and issue data
    let indie = indies[0]
    let issue = issues[0]
    let title = issue.title
    let issueNumber = issue.url.split('-')[1]
    let indiesInIssue = indies.filter(function (indie) {
        return indie.issue === issueNumber
    })
    let indieNames = indiesInIssue.map(function (indie) {
        return indie.name
    })

    if (indieNames.length > 0) {
        title = indieNames.slice(0, -1).join(',') + ' and ' + indieNames.slice(-1);
    }

    // Widget
    let imglogo = await loadLogo();
    const styles = {
        widgetCon: {
            backgroundColor: new Color("#ac3929"),
            url: "https://indiedevmonday.com/issue-" + indie.issue,
            '*setPadding': [15, 15, 15, 15]
        },
        hstack: {
            '*layoutHorizontally': null,
            '*bottomAlignContent': null
        },
        hstackText: {
            font: Font.lightRoundedSystemFont(18),
            textColor: Color.white(),
            lineLimit: 2,
            '*centerAlignText': null,
            minimumScaleFactor: 0.2
        },
        imglogo: {
            imageSize: new Size(30, 30),
            cornerRadius: 12
        },
        wTitle: {
            font: Font.boldRoundedSystemFont(22),
            lineLimit: 2
        },
        date: {
            font: Font.lightRoundedSystemFont(14)
        },
        hstack2: {
            '*layoutHorizontally': null,

        }
    };

    const issueImages = await (async () => {
        let returnArr = [];
        for (indie of indiesInIssue) {
            let urlSlug = "https://indiedevmonday.com/assets/images/indies/" + indie.slug + ".png";
            let img = await loadImage(urlSlug);
            returnArr.push(concatMarkup/* xml */`
                <image src="${img}" />
                <spacer value="8" />
            `);
        }
        return returnArr.join('');
    })();

    const w = await widgetMarkup/* xml */`
        <widget styles="${styles.widgetCon}">
            <stack styles="${styles.hstack}">
                <text styles="${styles.hstackText}">${"#" + issueNumber}</text>
                <spacer value="5" />
                <date value="${getIssueDate(issue)}" styles="${styles.date}" />
                <spacer />
                <image src="${imglogo}" styles="${styles.imglogo}" />
            </stack>
            <spacer value="8" />
            <text styles="${styles.wTitle}">${title}</text>
            <stack styles="${styles.hstack2}">
                <spacer />
                <spacer value="8" />
                ${issueImages}
                <spacer />
            </stack>
            <spacer />
        </widget>
    `;
    return w
}

function getIssueDate(issue) {
    let date = issue["date_published"]

    let formatter = new DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
    return formatter.date(date)
}


async function loadIndies() {
    let url = "https://indiedevmonday.com/indies.json"
    let req = new Request(url)
    return req.loadJSON()
}

async function loadIssues() {
    let url = "https://indiedevmonday.com/feed.json"
    let req = new Request(url)
    return req.loadJSON()
}

async function loadLogo() {
    let url = "https://indiedevmonday.com/assets/images/logo_trans.png"
    return await loadImage(url)
}

async function loadImage(url) {
    let req = new Request(url)
    return req.loadImage()
}