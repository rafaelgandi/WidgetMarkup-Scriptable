
# Widget Markup

<img src="https://github.com/rafaelgandi/WidgetMarkup-Scriptable/blob/eb7664a953fee6d0edd61ffe81d1764bcd693541/RoundedIcon.png" width="100" height="100" alt="Widget Markup for Scriptable"> 
Write Scriptable widgets with markup.

# Installation

Just import the library script to your scriptable widget file.

```jsx
const {widgetMarkup, concatMarkup} = importModule('WidgetMarkup');
```

The library exposes only two template literal tags, `widgetMarkup` and `concatMarkup`.

# `widgetMarkup`

This is the primary markdown parser. This is where you place your markups. It will return an instance of Scriptable's `ListWidget` class.

```jsx
const widget = await widgetMarkup`
  <widget>
    <spacer value="10" />
    <stack>
	       <text>Hi I'm a widget 👋</text>
    </stack
    <spacer value="15" />
  </widget>
`;
if (config.runsInWidget) {
    // Runs inside a widget so add it to the homescreen widget
    Script.setWidget(widget);
}
Script.complete()
```

# `concatMarkup`

This method is used to concatenate markup elements to the main widget body. This method is used to ensure that the parser can properly set the styles of the elements being concatenated.

```jsx

const textElement = concatMarkup`<text>I'm from the outside.</text>`

const widget = await widgetMarkup`
  <widget
    <stack>
	       ${textElement}
    </stack
  </widget>
`;
```

# Tags Supported

Currently the libtrary only supports the following tags

- `<widget>` — The parent element of the widget. There can only be one widget tag per widget. This is the container for all the elements in the widget.
- `<stack>` — The equivalent of Scriptable's [.addStack()](https://docs.scriptable.app/widgetstack/) method. This tag can have other tags inside as children. It could also have other stack tags as children.

    ```xml
    <stack>
    	<text>Hi I'm a text</text>
    	<spacer value="10" />
    </stack>
    ```

- `<text>` — The equivalent of Scriptable's [.addText()](https://docs.scriptable.app/widgettext/) method. Place widget text between this tag.

    ```xml
    <text>Hi I'm a widget text</text>
    ```

- `<image>` — The equivalent of Scriptable's [addImage()](https://docs.scriptable.app/widgetimage/) method. Used to add image to the widget. This tag requires a `src` attribute which takes in data with type [Image](https://docs.scriptable.app/image/).

    ```jsx

    const docsSymbol = SFSymbol.named("book");
    const widget = await widgetMarkup`
      <widget
    	    <stack>
    	       <image src="${docsSymbol.image}" />
    	    </stack
      </widget>
    `;
    ```

- `<spacer>` — The equivalent of Scriptable's [addSpacer()](https://docs.scriptable.app/widgetspacer/) method. This tag accepts a `value` attribute which takes in a numeric value for the length. If the value of the `value` attribute is 0 then this instructs the spacer to have a flexible length.
- `<date>` — The equivalent of Scriptable's [addDate()](https://docs.scriptable.app/widgetdate/) method. This tag requires `value` attribute which takes in an instance of the `Date` class.
