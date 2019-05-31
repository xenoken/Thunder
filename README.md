# Thunder


Thunder is an extension for Visual Studio Code that improves your typing experience. With Thunder you will type faster and more naturally.
![](res\example.gif)


## Description

Thunder works by replacing a **tracked** character with a string called **replacer** as soon as the tracked character is typed *twice* in a row.


# Getting Started

Thunder comes with a default Mapping List. For example to type the '"' (double quotes character) it is possible to avoid the SHIFT + 2 key combination and instead pressing twice the '2' character.
Thunder has default mappings for the common punctuation characters used in computer programming.

![](res\settings.png)

## Notes

To also allow tracked characters to be typed twice in a row without being replaced (Escaping them), Thunder also requires tracked characters to be typed quickly. the maximum time distance must be smaller than the MaxInterval setting.


## Features

- Forget Key combinations! Just double tap the character you need.

- Mappings are dynamic! Mappings can be changed at any time. No need to reactivate the extension.

- Language Specific Mappings! Activate different mappings for different languages.


## Extension Settings

This extension contributes the following settings:

* `thunder.maxInterval` : the maximum temporal distance between two typings of a tracked character to still trigger a replacement.

* `thunder.mappings` : The list of Thunder Mappings. Each Mapping element tells Thunder how to replace tracked characters.

* `thunder.debugMode` : Enables the logging of debug information to the console.



## Glossary

### Mappings

Thunder does a very simple job: replacing characters with other strings as soon as they are typed twice in a row.

To know *which* strings should be replaced and with *which* strings, Thunder rely on the Mappings list.

In the Mappings list are contained Mapping elements.

### Mapping

A mapping element is logically used by Thunder but it is not represented by a concrete class. In fact a Mapping is simply represented by an array[2].

The first element in the array is a character. This character is the *tracked* character. Thunder will always on the lookout for this character. Whenever this character is typed twice, it will be replaced.

The second element in the array is a string as well. This string is called the *replacer* and will be inserted in the text in place of the tracked character.

### Tracked character

Thunder continuously monitors the text added to the current textEditor and executes whenever one of these appear.

### Replacer

Thunder replaces any tracked character with the corresponding replacer string.



## Release Notes

see CHANGELOG.md


## Supported Languages

- plaintext
- Log
- log
- bat
- clojure
- coffeescript
- jsonc
- c
- cpp
- csharp
- css
- dockerfile
- ignore
- fsharp
- git-commit
- git-rebase
- diff
- go
- groovy
- handlebars
- hlsl
- html
- ini
- properties
- java
- javascriptreact
- javascript
- jsx-tags
- json
- less
- lua
- makefile
- markdown
- objective-c
- objective-cpp
- perl
- perl6
- php
- powershell
- jade
- python
- r
- razor
- ruby
- rust
- scss
- shaderlab
- shellscript
- sql
- swift
- typescript
- typescriptreact
- vb
- xml
- xsl
- yaml
- dart
- pip-requirements
- toml
- jinja
- jupyter
- aspnetcorerazor