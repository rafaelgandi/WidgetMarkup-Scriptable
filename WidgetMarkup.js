// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: microscope;

////////////////////////////////////////////////////////////////////////////////////
// {</>} WidgetMarkup - Simple implementation of markup for Scriptable iOS widgets.
////////////////////////////////////////////////////////////////////////////////////
// Version 0.20210812a


function _getObjectClass(obj) {
    // See: https://stackoverflow.com/a/12730085
    if (obj && obj.constructor && obj.constructor.toString) {
        let arr = obj.constructor.toString().match(/function\s*(\w+)/);
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }
    return undefined;
}

function _mapMethodsAndCall(inst, options) {
    Object.keys(options).forEach((key) => {
        if (key.indexOf('*') !== -1) {
            key = key.replace('*', '');
            if (!(key in inst)) {
                throw new Error(`Method "${key}()" is not applicable to instance of ${_getObjectClass(inst)}`);
            }
            if (Array.isArray(options['*' + key])) {
                inst[key](...options['*' + key]);
            }
            else {
                inst[key](options[key]);
            }
        }
        else {
            if (!(key in inst)) {
                throw new Error(`Property "${key}" is not applicable to instance of ${_getObjectClass(inst)}`);
            }
            inst[key] = options[key];
        }
    });
    return inst;
}

function _iterateChildren(widgetInstance, children) {
    children.forEach((child) => {
        if (child.tag === 'text') {
            const holderKeyRegExp = /(\$\$\[.+\])/ig;
            if (holderKeyRegExp.test(child.textContent)) {
                child.textContent = child.textContent.replace(holderKeyRegExp, (match, p1) => {
                    return holder[p1].toString();
                });
            }
            let t = widgetInstance.addText(child.textContent);
            _mapMethodsAndCall(t, _getAttrValue(child.attributes, 'styles'));
        }
        else if (child.tag === 'spacer') {
            let space = parseInt(_getAttrValue(child.attributes, 'value'), 10);
            if (space < 1 || isNaN(space)) {
                widgetInstance.addSpacer();
            }
            else {
                widgetInstance.addSpacer(space);
            }
        }
        else if (child.tag === 'image') {
            let img = widgetInstance.addImage(_getAttrValue(child.attributes, 'src'));
            _mapMethodsAndCall(img, _getAttrValue(child.attributes, 'styles'));
        }
        else if (child.tag === 'date') {
            let date = widgetInstance.addDate(_getAttrValue(child.attributes, 'value'));
            _mapMethodsAndCall(date, _getAttrValue(child.attributes, 'styles'));
        }
        else if (child.tag === 'stack') {
            let stack = widgetInstance.addStack();
            _mapMethodsAndCall(stack, _getAttrValue(child.attributes, 'styles'));
            _iterateChildren(stack, child.children);
        }
    });
    return widgetInstance;
}

function _getAttrValue(attrs = [], name = 'styles') {
    let attr = {};
    attrs.forEach((a) => {
        if (a.name.toLowerCase() === name.toLowerCase()) {
            if (typeof holder[a.value] !== 'undefined') {
                attr = holder[a.value];
            }
            else {
                attr = a.value;
            }
        }
    });
    return attr;
}

const holder = {};
function _replacer(str, eq) {
    let builtStr = '';
    str.forEach((s, i) => {
        if (eq[i]) {
            if (Array.isArray(eq[i])) {
                eq[i] = eq[i].join('');
            }
            if (typeof eq[i] === 'string') {
                builtStr += s + eq[i];
            }
            else {
                let k = '$$[' + UUID.string() + (Math.floor(Math.random() * 20)) + ']';
                holder[k] = eq[i];
                builtStr += s + k;
            }
        }
        else {
            builtStr += s;
        }

    });
    return builtStr;
}

function concatMarkup(str, ...eq) {
    let r = _replacer(str, eq);
    return r;
}

async function _getMappedDOM(markup) {
    const webview = new WebView();
    await webview.loadHTML('<html></html>');
    //console.log(markup);
    markup = markup.replace(/(\r\n|\n|\r)/gm, ''); // See: https://stackoverflow.com/a/10805198
    markup = `<tabom>${markup}</tabom>`;
    // See: https://gomakethings.com/how-to-create-a-map-of-dom-nodes-with-vanilla-js/
    const js = `
    var getAttributes = function (attributes) {
        return Array.prototype.map.call(attributes, function (attribute) {
            return {
                name: attribute.name,
                value: attribute.value
            };
        });
    };
    
    var createDOMMap = function (element) {
        return Array.prototype.map.call(element.childNodes, (function (node) {
            if (node.nodeType !== 3 && node.nodeType !== 8) {
                var details = {
                    tag: node.tagName.toLowerCase(),
                    textContent: node.textContent,
                    attributes: node.nodeType !== 1 ? [] : getAttributes(node.attributes)
                };
                details.children = createDOMMap(node);
                return details;
            }
            return null;
        })).filter((e) => e !== null);
    };
    
    function getDom() {
        let htmlStr = '${markup}';
        const dom = new DOMParser();
        let doc = dom.parseFromString(htmlStr, 'application/xml');
        return JSON.stringify(createDOMMap(doc.documentElement));
    }
    try {
        completion(getDom());
    }
    catch (err) {
        completion([{
            tag: 'error',
            textContent: err.message
        }]);
    }    
  `;
    let response = await webview.evaluateJavaScript(js, true);
    const mappedArray = JSON.parse(response);
    if (mappedArray.length && mappedArray[0].tag.toLocaleLowerCase().indexOf('error') !== -1) {
        throw new Error(mappedArray[0].textContent);
    }
    return mappedArray;
}

async function widgetMarkup(str, ...eq) {
    let markup = _replacer(str, eq);
    let map = await _getMappedDOM(markup);
    const parentElementMap = map[0];
    if (typeof parentElementMap === 'undefined') {
        throw new Error("WidgetMarkup requires that the <widget> element be the parent element of your widget.");
    }
    const childrenMap = parentElementMap.children;
    const widget = new ListWidget();
    _mapMethodsAndCall(widget, _getAttrValue(parentElementMap.attributes, 'styles'));
    _iterateChildren(widget, childrenMap);
    return widget;
}

module.exports.widgetMarkup = widgetMarkup;
module.exports.concatMarkup = concatMarkup;
