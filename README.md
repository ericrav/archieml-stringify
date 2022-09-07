# ArchieML Stringify

<a href="https://www.npmjs.com/package/archieml-stringify">
  <img src="https://img.shields.io/npm/v/archieml-stringify">
</a>


Stringify a JS object into a string that can be parsed as [ArchieML](http://archieml.org/) back into your original object. This can be useful for generating ArchieML templates that can be copy/pasted into a Google Doc.

## Installation

```
yarn add archieml-stringify
```

_or_

```
npm i -S archieml-stringify
```

## Usage

```js
import archieml from 'archieml-stringify';
// or: import { stringify } from 'archieml-stringify';

const string = archieml.stringify({
  colors: {
    red: '#f00',
    green: '#0f0',
    blue: '#00f',
    grays: {
      light: '#aaa',
      dark: '#333',
    },
  },
  numbers: [1, 10, 50],
  key: 'value',
  freeform: [
    { type: 'name', value: 'Archie' },
    { type: 'awesome', value: true },
    { type: 'text', value: 'Lorem ipsum...' },
  ],
});
```

Results in the string:

```
{colors}
red: #f00
green: #0f0
blue: #00f
{.grays}
light: #aaa
dark: #333
{}
{}
[numbers]
* 1
* 10
* 50
[]
key: value
[+freeform]
name: Archie
awesome: true
Lorem ipsum...
[]
```

### Comments

In ArchieML, any line that isn't parsed as a value is treated as a comment. The `COMMENT` function lets you add additional text to your output while ensuring it won't be parsed as ArchieML.

```js
import { stringify, COMMENT } from 'archieml-stringify';

stringify({
  key: 'value',
  my_comment: COMMENT('This is a comment.'),
  safe_comment: COMMENT('key: Comments that look like valid ArchieML are escaped'),
});
```

Results in the string:

```
key: value
This is a comment.
\\key: Comments that look like valid ArchieML are escaped
```

### Formatting

By default, objects are stringified as plain-text ArchieML, but a `formatter` can be provided to customize styling or even create HTML, which is useful if you intend to create styled Google Docs of your ArchieML text.

A custom formatter can be provided by:

```js
import { stringify } from 'archieml-stringify';

const formatter = (strings, context) => { /* Function called on each object value, letting you insert additional string content */ };

stringify(myObj, { formatter });
```

The `formatter` should return a string. It's called on each value of your input object with 2 parameters: `strings` and `context`.

`strings` is an array of the parts of the plain-text ArchieML string. To get the default stringified output, you can simply return `strings.join('')`

`context` is an object containing the current key and value being stringified. It has 4 properties:

- `key` : key from object being stringified
- `value` : corresponding value from original object
- `path` : Array of keys (including current key), indicating nested location in original object
- `parent` : The value at the path minus the current segment. When stringifying the root-level keys, `parent` will be the original object passed into `stringify`.


Look at [src/__tests__/format.test.ts](src/__tests__/format.test.ts) to see examples.
