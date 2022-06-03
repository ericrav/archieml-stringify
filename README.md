# ArchieML Stringify

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
