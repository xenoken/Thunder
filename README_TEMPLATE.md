# Thunder README

Thunder is a small extension that improves the typing experience, allowing writers to type characters more quickly and efficiently.

Thunder keeps an internal list of strings that are called the 'tracked' strings list. Whenever a string in the 'tracked' string is typed, it will be replaced with another string.

Thunder knows how to replace each 'tracked' string instance, by looking up the typed string in the 'Mappings' list. 

The 'Mappings' list is just an array of 'Mapping' elements, each represented by an array.
Each array must contain two strings. the first string is the tracked string. the second string is the string that will replace the tracked string whenever it is quickly typed **twice** in a row.

## Features

- Forget Key combinations! Just double tap the character you want.


## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `thunder.maxinterval` : The maximum time to pass between two keypresses to still invoke a thunder Combo.
* `thunder.mappings` : The list of Thunder Mappings. Each Mapping tells Thunder how to replace tracked characters.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
