import archieml from 'archieml';
import { stringify } from '../stringify';

const obj = {
  '00001array': [],
  '00002array': [],
  '00003array': [],
  '00004array': [],
  '00005array': [],
  '00006array': [],
  '00007scope': { array: [] },
  '00008array': [
    { '00008scope': { key: 'value' } },
    { '00008scope': { key: 'value' } },
  ],
  '00009array': [],
  '00009key': 'value',
  '00010array': [],
  '00010key': 'value',
  '00011array': [],
  '00011key': 'value',
  '00012array': [],
  '00012key': 'value',
  '00013array': [],
  '00013key': 'value',
  '00014array': [],
  '00014topkey': 'value',
  '00015array': [{ '00015key': 'value' }],
  '00016array': [{ '00016key': 'value', '00016second': 'value' }],
  '00017array': [
    { '00017key': 'value', '00017second': 'value' },
    { '00017key': 'value' },
  ],
  '00018array': [{ '00018key': 'first' }, { '00018key': 'second' }],
  '00019array': [
    { '00019scope': { key: 'first' } },
    { '00019scope': { key: 'second' } },
  ],
  '00020array': [{ '00020key': 'value', '00020scope': { key: 'value' } }],
  '00021array': [
    {
      '00021scope': { key: 'value' },
      '00021key': 'value',
      '00021otherscope': { key: 'value' },
    },
  ],
  '00022array1': [{ '00022key': 'value' }],
  '00022array2': [],
  '00023array': [{ '00023key': 'value' }],
  '00023scope': {},
  '00024array': [{ '00024key': 'value', '00024other': 'value\nmore text' }],
  '00025array': [{ '00025key': 'value\n* value\nmore text' }],
  '00026array': [{ '00026key': 'value' }],
  '00027array': [{ '00027key': 'value 2' }],
  '00028array': ['Value'],
  '00029a': { b: [{ '00029key': 'value' }] },
  '00030array': [],
  '00030': { subarray: [{ '00030key': 'value' }] },
  '00031array': [],
  '00031': { subarray: ['Value 1', 'Value 2'] },
  '00032array': [],
  '00032': { subarray: [{ '00032key': 'value' }, { '00032key': 'value' }] },
  '00033array': [],
  '00033': {
    subarray: [
      { '00033key1': 'value', '00033key2': 'value' },
      { '00033key1': 'value', '00033key2': 'value' },
    ],
  },
  '00034array': [],
  '00034': { subarray: [{ '00034subkey': 'value' }] },
  '00034parentkey': 'value',
  '00035array': [{ '00035parentkey': 'value' }],
  '00035': { subarray: [{ '00035subkey': 'value' }] },
  '00036array': [{ '00036key': 'value' }],
  '00036': { subarray: [{ '00036subkey': 'value' }] },
  '00036key': 'value',
  '00037array': [{ '00037key': 'value' }],
  '00037': { subarray: [{ '00037subkey': 'value' }] },
  '00037key': 'value',
  '00038array': [],
  '00038': { subarray: [] },
  '00039array': [],
  '00039': {
    subarray: [],
    subsubarray: [{ '00039key1': 'Value 1', '00039key2': 'Value 2' }],
  },
  '00040array': [],
  '00040': { subarray: [], subsubarray: ['Value 1', 'Value 2'] },
  '00041': { subarray: [{ '00041key': 'value' }] },
  '00042array': ['Value'],
  '00043array': ['Value'],
  '00044array': ['Value'],
  '00045array': ['Value 1', 'Value 2'],
  '00046array': ['Value 1', 'Value 2'],
  '00047array': ['Value 1', 'Value 2'],
  '00048array': ['Value 1'],
  '00048key': 'value',
  '00049array': ['Value 1\nextra'],
  '00050array': ['Value 1\n* extra'],
  '00051array': ['Value1\n:end'],
  '00052array': ['Value1\nkey\\:value'],
  '00053array': ['Value\nkey:value'],
  '00054array': ['Value 1\nword key\\:value'],
  '00055array1': ['value'],
  '00055array2': [],
  '00056array': ['value'],
  '00056scope': {},
  '00057array': ['value\n00057key: value\nmore text'],
  '00058array': ['value', 'value\nmore text'],
  '00059array': ['value'],
  '00060array': ['Value 2'],
  '00061array': [{ '00061key': 'value' }],
  '00062a': { b: ['simple value'] },
  freeform: [{ type: 'text', value: '* value' }],
  '00069array': [
    {
      '00069name': 'value',
      freeform: [
        { type: '00069name', value: 'value' },
        { type: 'text', value: 'Text' },
      ],
    },
  ],
  '00072scope': { freeform: [{ type: 'text', value: 'Value' }] },
  '00076key': 'value',
  '00077key': 'value',
  '00082a-_1': 'value',
  '00084scope': { key: 'value' },
  '00085scope': { key: 'value', otherkey: 'value' },
  '00086string_to_object': { scope: { scope: 'value' } },
  '00086object_to_string': { scope: 'value' },
  '00087key': 'value\nextra',
  '00088key': 'value\nextra',
  '00089key': 'value\n\t \nextra',
  '00090key': 'value\nextra',
  '00091key': 'value\t \nextra',
  '00092key': 'value\nextra',
  '00093key': 'value\nextra',
  '00094key': 'value\nextra',
  '00095key': 'value\nextra',
  '00096key': 'value',
  '00097key': 'value\n:notacommand',
  '00098key': 'value\nextra',
  '00099key': 'value\nextra',
  '00100key': ':value',
  '00101key': '\\:value',
  '00102key': 'value\nkey2\\:value',
  '00103key': 'value\nkey2:value',
  '00104key': 'value\n:end',
  '00105key': 'value\n:endthis',
  '00106key': 'value\n:notacommand',
  '00107key': 'value\n* value',
  '00108key': 'value\n* value',
  '00109key': 'value\n{scope}',
  '00110key': 'value',
  '00110array': [],
  '00111key': 'value',
  '00111scope': {},
  '00112key': 'value\ntext\n* value\nmore text',
  '00113key': 'value',
  '00114key': 'value\n\\:end',
  '00115key': 'value\n\\\\:end',
  '00116key': 'value\n:end\n:ignore\n:endskip\n:skip',
  '00117key': 'value\nLorem key2\\\\:value',
  '00118scope': { '00118key': 'value\ntext\n* value\nmore text' },
  '00119scope': {},
  '00120scope': {},
  '00121scope': {},
  '00122scope': {},
  '00123scope': {},
  '00124scope': {},
  '00125key': 'value',
  '00125scope': {},
  '00126scope': { '00126key': 'value' },
  '00127scope': { scope: { '00127key': 'value' } },
  '00128scope': { '00128key': 'value', '00128other': 'value' },
  '00129scope': {
    scope: { '00129key': 'value' },
    otherscope: { '00129key': 'value' },
  },
  '00130scope': {},
  '00130key': 'value',
  '00131scope': {},
  '00131key': 'value',
  '00132scope': {},
  '00132key': 'value',
  '00133scope': {},
  '00133key': 'value',
  '00134scope': {},
  '00134key': 'value',
  '00135key': { '00135subkey': 'subvalue' },
  '00136scope1': { '00136key1': 'value1' },
  '00136scope2': { '00136key2': 'value2' },
  '00136key': 'value',
  '00141key': 'value',
  '00146key': 'value',
  '00147key': 'value',
  '00148key': 'value',
  '00150key1': 'value1',
  '00150key2': 'value2',
  π: [{ '00153value': '3.14159', '00153name': 'Pi' }],
  你好: '你好世界',
  '🐶🐮': 'dogcow',
  '🐶': { '🐮': 'cow' },
  '🐮': [
    { type: 'text', value: 'This text belongs to a cow.' },
    { type: 'text', value: '===' },
  ],
  '00156key': 'value',
  '00157key': 'value',
  '00158key': 'value',
  '00159key': 'value',
  '00160key': 'value',
  '00161key': 'newvalue',
  '00162key': ':value',
  '00163key': 'value',
  '00163Key': 'Value',
  '00164key': 'value',
  '00165key': '<strong>value</strong>',
};

test('output parses back to object', () => {
  const stringified = stringify(obj);
  expect(archieml.load(stringified)).toEqual(obj);
});

test('stringifies combined output', () => {
  expect(stringify(obj)).toMatchInlineSnapshot(`
"[00001array]
[]
[00002array]
[]
[00003array]
[]
[00004array]
[]
[00005array]
[]
[00006array]
[]
{00007scope}
[.array]
[]
{}
[00008array]
{.00008scope}
key: value
{}

{.00008scope}
key: value
{}
[]
[00009array]
[]
00009key: value
[00010array]
[]
00010key: value
[00011array]
[]
00011key: value
[00012array]
[]
00012key: value
[00013array]
[]
00013key: value
[00014array]
[]
00014topkey: value
[00015array]
00015key: value
[]
[00016array]
00016key: value
00016second: value
[]
[00017array]
00017key: value
00017second: value

00017key: value
[]
[00018array]
00018key: first

00018key: second
[]
[00019array]
{.00019scope}
key: first
{}

{.00019scope}
key: second
{}
[]
[00020array]
00020key: value
{.00020scope}
key: value
{}
[]
[00021array]
{.00021scope}
key: value
{}
00021key: value
{.00021otherscope}
key: value
{}
[]
[00022array1]
00022key: value
[]
[00022array2]
[]
[00023array]
00023key: value
[]
{00023scope}
{}
[00024array]
00024key: value
00024other: value
more text
:end
[]
[00025array]
00025key: value
\\\\* value
more text
:end
[]
[00026array]
00026key: value
[]
[00027array]
00027key: value 2
[]
[00028array]
* Value
[]
{00029a}
[.b]
00029key: value
[]
{}
[00030array]
[]
{00030}
[.subarray]
00030key: value
[]
{}
[00031array]
[]
{00031}
[.subarray]
* Value 1
* Value 2
[]
{}
[00032array]
[]
{00032}
[.subarray]
00032key: value

00032key: value
[]
{}
[00033array]
[]
{00033}
[.subarray]
00033key1: value
00033key2: value

00033key1: value
00033key2: value
[]
{}
[00034array]
[]
{00034}
[.subarray]
00034subkey: value
[]
{}
00034parentkey: value
[00035array]
00035parentkey: value
[]
{00035}
[.subarray]
00035subkey: value
[]
{}
[00036array]
00036key: value
[]
{00036}
[.subarray]
00036subkey: value
[]
{}
00036key: value
[00037array]
00037key: value
[]
{00037}
[.subarray]
00037subkey: value
[]
{}
00037key: value
[00038array]
[]
{00038}
[.subarray]
[]
{}
[00039array]
[]
{00039}
[.subarray]
[]
[.subsubarray]
00039key1: Value 1
00039key2: Value 2
[]
{}
[00040array]
[]
{00040}
[.subarray]
[]
[.subsubarray]
* Value 1
* Value 2
[]
{}
{00041}
[.subarray]
00041key: value
[]
{}
[00042array]
* Value
[]
[00043array]
* Value
[]
[00044array]
* Value
[]
[00045array]
* Value 1
* Value 2
[]
[00046array]
* Value 1
* Value 2
[]
[00047array]
* Value 1
* Value 2
[]
[00048array]
* Value 1
[]
00048key: value
[00049array]
* Value 1
extra
:end
[]
[00050array]
* Value 1
\\\\* extra
:end
[]
[00051array]
* Value1
\\\\:end
:end
[]
[00052array]
* Value1
\\\\key\\\\:value
:end
[]
[00053array]
* Value
\\\\key:value
:end
[]
[00054array]
* Value 1
word key\\\\:value
:end
[]
[00055array1]
* value
[]
[00055array2]
[]
[00056array]
* value
[]
{00056scope}
{}
[00057array]
* value
\\\\00057key: value
more text
:end
[]
[00058array]
* value
* value
more text
:end
[]
[00059array]
* value
[]
[00060array]
* Value 2
[]
[00061array]
00061key: value
[]
{00062a}
[.b]
* simple value
[]
{}
[+freeform]
* value
[]
[00069array]
00069name: value
[.+freeform]
00069name: value
Text
[]
[]
{00072scope}
[.+freeform]
Value
[]
{}
00076key: value
00077key: value
00082a-_1: value
{00084scope}
key: value
{}
{00085scope}
key: value
otherkey: value
{}
{00086string_to_object}
{.scope}
scope: value
{}
{}
{00086object_to_string}
scope: value
{}
00087key: value
extra
:end
00088key: value
extra
:end
00089key: value
	 
extra
:end
00090key: value
extra
:end
00091key: value	 
extra
:end
00092key: value
extra
:end
00093key: value
extra
:end
00094key: value
extra
:end
00095key: value
extra
:end
00096key: value
00097key: value
:notacommand
:end
00098key: value
extra
:end
00099key: value
extra
:end
00100key: :value
00101key: \\\\:value
00102key: value
\\\\key2\\\\:value
:end
00103key: value
\\\\key2:value
:end
00104key: value
\\\\:end
:end
00105key: value
\\\\:endthis
:end
00106key: value
:notacommand
:end
00107key: value
\\\\* value
:end
00108key: value
\\\\* value
:end
00109key: value
\\\\{scope}
:end
00110key: value
[00110array]
[]
00111key: value
{00111scope}
{}
00112key: value
text
\\\\* value
more text
:end
00113key: value
00114key: value
\\\\\\\\:end
:end
00115key: value
\\\\\\\\\\\\:end
:end
00116key: value
\\\\:end
\\\\:ignore
\\\\:endskip
\\\\:skip
:end
00117key: value
Lorem key2\\\\\\\\:value
:end
{00118scope}
00118key: value
text
\\\\* value
more text
:end
{}
{00119scope}
{}
{00120scope}
{}
{00121scope}
{}
{00122scope}
{}
{00123scope}
{}
{00124scope}
{}
00125key: value
{00125scope}
{}
{00126scope}
00126key: value
{}
{00127scope}
{.scope}
00127key: value
{}
{}
{00128scope}
00128key: value
00128other: value
{}
{00129scope}
{.scope}
00129key: value
{}
{.otherscope}
00129key: value
{}
{}
{00130scope}
{}
00130key: value
{00131scope}
{}
00131key: value
{00132scope}
{}
00132key: value
{00133scope}
{}
00133key: value
{00134scope}
{}
00134key: value
{00135key}
00135subkey: subvalue
{}
{00136scope1}
00136key1: value1
{}
{00136scope2}
00136key2: value2
{}
00136key: value
00141key: value
00146key: value
00147key: value
00148key: value
00150key1: value1
00150key2: value2
[π]
00153value: 3.14159
00153name: Pi
[]
你好: 你好世界
🐶🐮: dogcow
{🐶}
🐮: cow
{}
[+🐮]
This text belongs to a cow.

===
[]
00156key: value
00157key: value
00158key: value
00159key: value
00160key: value
00161key: newvalue
00162key: :value
00163key: value
00163Key: Value
00164key: value
00165key: <strong>value</strong>"
`);
});
