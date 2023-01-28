# MathEditor tool

The MathEditor Block for the [Editor.js](https://editorjs.io). 

![](https://photos.app.goo.gl/NGATd7rQa3fh6vV7A)

## Installation

Get the package

```shell
npm i --save editorjs-mathlive
```
or

```shell
yarn add editorjs-mathlive
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
import MathEditor from 'editorjs-mathlive';

var editor = EditorJS({
  tools: {
    math: MathEditor,
  }
});
```

Or init the MathEditor tool with additional settings

```javascript
var editor = EditorJS({
  tools: {
    math: {
      class: MathEditor,
      inlineToolbar: true,
      config: {
        virtualKeyboardMode: 'manual',
        defaultMode: 'math',
        smartMode:false,
        virtualKeyboardTheme:'material',
      },
    },
  },
});
```

## Config Params

| Field              | Type     | Description          |
| ------------------ | -------- | ---------------------------------------- |
| `virtualKeyboardMode`             | `string` | initial mode of virtual keyboard. `manual`  by default |
| `defaultMode`             | `string` | initial editing mode. `math` by default |
| `smartMode`             | `boolean` |  MathEditor mode. `false` by default |
| `virtualKeyboardTheme`             | `string` |  MathEditor keyboard theme. `material` by default |


## Config Params Optional values

| Field              | Type     | Option values         |
| ------------------ | -------- | ---------------------------------------- |
| `virtualKeyboardMode`             | `string` |  `manual`, `auto`, `onfocus`,`off` |
| `defaultMode`             | `string` | `math` , `inline-math`, `text` |
| `smartMode`             | `boolean` |  `false`, `true` |
| `virtualKeyboardTheme`             | `string` |  `material`, `apple` |


## Output data

This Tool returns `data` in the following format

| Field          | Type         | Description           |
| -------------- | ------------ | ----------------------------------------- |
| `type` | `string`    | Style of math text |
| `latex`      | `string` | Mathematical equation text in latexs |

```json
{
  "type" : "math",
  "data" : {
    "type": "cdx-math-info",
    "latex" : "e=mc^2"
  }
}
```
