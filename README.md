# Thunder README


Thunder is a small extension that improves the typing experience, allowing writers to type characters more quickly and efficiently.

## Description

Thunder works by replacing a **tracked** string with another string whenever it is typed twice in a row.

Thunder maintains an internal list of strings called the 'tracked strings' list. Whenever a string in the 'tracked' string is typed in a text editor, it will be replaced with another string.

Thunder knows how to replace each 'tracked' string instance, by looking up the typed string in the 'Mappings' list. 

The 'Mappings' list is just an array of 'Mapping' elements, each represented by an array.

Each array must contain two strings. the *first* is the tracked string. the *second* string is the string that will replace the tracked string whenever it is quickly typed **twice** in a row.

To also allow string to be typed twice in a row without being replaced, Thunder also requires tracked strings to typed quickly. the maximum time distance must be smaller than the MaxInterval setting.

## Features

- Forget Key combinations! Just double tap the character you want.

- Mappings are dynamic! Mappings can be changed at any time. No need to reactivate the extension.


## Extension Settings

This extension contributes the following settings:

* `thunder.maxInterval` : The maximum time to pass between two keypresses to still invoke a thunder Combo.

* `thunder.mappings` : The list of Thunder Mappings. Each Mapping element tells Thunder how to replace tracked strings.

## Glossary

### Mappings

Thunder does a very simple job: replacing strings with other strings as soon as they are typed twice in a row.

To know *which* strings should be replaced and with *which* strings, Thunder rely on the Mappings list.

In the Mappings list are contained Mapping elements.

### Mapping
A mapping element is logically used by Thunder but it is not represented by a concrete class. In fact a Mapping is simply represented by two-elements-long array.

The first element in the array is a string. this string is the 'tracked' string. Thunder will always on the lookout for this string. Whenever this string is typed twice, it will be replaced.

The second element in the array is a string as well. This string is called the 'replacer' and will be inserted in the text in place of the tracked string.

### Tracked String
Thunder continuously monitors the text added to the current textEditor and executes whenever one of these appear.

### Replacers String
Thunder replaces any tracked string with the corresponding Replacer.


## Release Notes


### 0.1.0

Initial release of Thunder.

