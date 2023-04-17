# Changelog

### 4/17/2023

great-expectations 1.2.0

#### Added
- Support for matching a map
- Print assertion errors properly when using Uvu


### 2/20/2023

great-expectations 1.1.1

#### Fixed
- Set `.js` extensions for all imports so module resolution will
work correctly in node.


### 2/5/2023

great-expectations 1.1.0

#### Added
- assignedWith matcher to make expectations about variables that are
potentially undefined
- Better messages when expecting that a value is undefined

#### Fixed
- Matcher types are exposed at the top level to better facilitate custom
matchers in Typescript


### 1/16/2023

Initial release