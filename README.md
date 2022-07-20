
# Widget Markup

<img src="https://github.com/rafaelgandi/WidgetMarkup-Scriptable/blob/eb7664a953fee6d0edd61ffe81d1764bcd693541/RoundedIcon.png" width="100" height="100" alt="Widget Markup for Scriptable"> 
Write Scriptable widgets with markup.

# Installation

Just import the library script to your scriptable widget file.

```jsx
const { widgetMarkup, concatMarkup } = importModule('WidgetMarkup');
```
Alternatively if you would rather have just one file for your widget, you can copy the contents of `WidgetMarkup.min.js` and paste it on top of your widget file. Then import it like so...
```jsx
const { widgetMarkup, concatMarkup } = WidgetMarkup;
```

# Usage
The library exposes only two template literal tags, `widgetMarkup` and `concatMarkup`.

## `widgetMarkup`

This is the primary markup parser. This is where you place your markup tags and is the main body of your widget. It will return an instance of Scriptable's `ListWidget` class.

```jsx
const widget = await widgetMarkup`
  <widget>
    <spacer value="10" />
    <stack>
	<text>Hi I'm a widget 👋</text>
    </stack>
    <spacer value="15" />
  </widget>
`;
if (config.runsInWidget) {
    // Runs inside a widget so add it to the homescreen
    Script.setWidget(widget);
}
Script.complete()
```

## `concatMarkup`

This method is used to concatenate markup elements to the main widget body. This method is used to ensure that the parser can properly set the styles of the elements being concatenated.

```jsx

const textElement = concatMarkup`<text>I'm from the outside.</text>`

const widget = await widgetMarkup`
  <widget
     <stack>
        ${textElement}
     </stack>
  </widget>
`;
```

# Tags Supported

Currently the library only supports the following tags

- `<widget>` — The parent element of the widget. There can only be one widget tag per widget. This is the container for all the elements in the widget.
- `<stack>` — The equivalent of Scriptable's [.addStack()](https://docs.scriptable.app/widgetstack/) method. This tag can have other tags inside as children. It could also have other stack tags as children.

    ```xml
    <stack>
    	<text>Hello World</text>
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
      <widget>
    	<stack>
    	   <image src="${docsSymbol.image}" />
    	</stack>
      </widget>
    `;
    ```

- `<spacer>` — The equivalent of Scriptable's [addSpacer()](https://docs.scriptable.app/widgetspacer/) method. This tag accepts a `value` attribute which takes in a numeric value for the length. If the value of the `value` attribute is 0 then this instructs the spacer to have a flexible length.
- `<date>` — The equivalent of Scriptable's [addDate()](https://docs.scriptable.app/widgetdate/) method. This tag requires `value` attribute which takes in an instance of the `Date` class.

# Styling

All tags can accept a `styles` attribute. This attribute can only accept an object which is the list of styles the element will have. Here's a simple example of styling a text element.

```jsx
const textStyles = {
	minimumScaleFactor: 0.5,
  	textColor: Color.white(),
  	font: Font.systemFont(18)	
};

const widget = await widgetMarkup`
  <widget>
  	<text styles="${textStyles}">Hello World</text>
  </widget>
`;
```

The code above would be equivalent to this in Scriptable.

```jsx
const widget = new ListWidget();
const text = widget.addText('Hello World');
text.minimumScaleFactor = 0.5;
text.textColor = Color.white();
text.font = Font.systemFont(18);
```

The library encourages you to separate your styles from the structure of your widget. As the complexity of the structure of your widget grows, this way of coding will hopefully make your code more readable and maintainable.

## Methods

Some styling properties in Scriptable needs to be called as a function/method. An example of this is `layoutVertically` or `layoutHorizontally` for stacks. For this type of styling, the library requires that the method name should be prefixed with a `*` . This is to signal to the parser that the styling property needs to be called as a function. Here's an example.

```jsx
const stackStyles = {
    '*layoutVertically': null, // prefix with * and given a value of null if the method does not require a parameter.
    size: new Size(100, 20)
};

const widget = await widgetMarkup`
  <widget>
  	<stack styles="${stackStyles}">
            ...
        </stack>
  </widget>
`;
```

Which would be equivalent to this...

```jsx
const widget = new ListWidget();
const stackElement = widget.addStack();
stackElement.layoutVertically(); // Called as a function.
stackElement.size = new Size(100, 20);
```

What if the styling method requires a parameter? A perfect example of this is the `setPadding` method which can take four parameters. For this you can pass in the parameters as an array of values.

```jsx
const stackStyles = {
    '*setPadding': [5, 9, 5, 5], // Assign an array of values for the parameters
    size: new Size(100, 20)
};

const widget = await widgetMarkup`
  <widget>
	<stack styles="${stackStyles}">
            ...
        </stack>
  </widget>
`;
```

The code above is equivalent to...

```jsx
const widget = new ListWidget();
const stackElement = widget.addStack();
stackElement.setPadding(5, 9, 5, 5); // Padding assigned.
stackElement.size = new Size(100, 20);
```

# Syntax Highlighting

If you are using vscode for development. I suggest installing [Matt Bierner's Comment tagged templates](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates) extension. This makes your widget markup even more readable while you code.

<img src="https://github.com/rafaelgandi/WidgetMarkup-Scriptable/blob/a71581a543789e2bf6bbcecdc6089e8c2111fcbd/vscode-markup-highlighting.png" alt="Markup syntax highlighting"> 

# Conclusion

This library is still on a very early stage of development and you may encounter bugs. Just let me know if you have any questions about it or if you found a bug. You can contact me [here](https://rafaelgandi.com/contact). This library is also open for you to edit and improve. Play around with it and make it work for your needs. Hopefully it encourages you to write more awesome Scriptable iOS widgets.

If you find this library helpful, send me a screenshot of your widget or a code snippet on how you are using it. I'd love to see how you guys are using this library.


[![Download with ScriptDude](https://scriptdu.de/download.svg)](https://scriptdu.de/?name=Widget+Markup&source=https%3A%2F%2Fraw.githubusercontent.com%2Frafaelgandi%2FWidgetMarkup-Scriptable%2Fmain%2FWidgetMarkup.js&docs=https%3A%2F%2Fgithub.com%2Frafaelgandi%2FWidgetMarkup-Scriptable%2Fblob%2Fmain%2FREADME.md#installation)
