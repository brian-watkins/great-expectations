# Changelog

### 5/21/2025

great-expectations 1.10.2

### Fixed
- Improved type safety when using expect


### 4/1/2025

great-expectations 1.10.0

### Added
- set matchers


### 2/26/2025

great-expectations 1.9.0

### Added
- valueWhere matcher for easier custom matchers


### 2/24/2025

great-expectations 1.7.0

### Added
- Type inference driven by the actual for less errors
- Assert that strings match a regex some number of times


### 1/29/2025

great-expectations 1.6.0

#### Added
- retry expectations with eventually
- disable ANSI character codes with NO_COLOR env var


### 8/13/2023

great-expectations 1.5.1

#### Fixed
- Stringify instances of Error properly


### 8/11/2023

great-expectations 1.5.0

#### Added
- Expect that functions throw
- Match objects that instantiate some class
- `is`, `throws`, `resolvesTo`, and `rejectsWith` use the `equalTo` matcher with
the provided value, if a matcher is not provided.

#### Fixed
- Improved jest example


### 5/31/2023

great-expectations 1.4.0

#### Added
- Support for consuming great-expectations as a commonjs module
in projects that need to do so.


### 4/20/2023

great-expectations 1.3.0

#### Added
- Support for matching an entry contained in a map
- Type support for object matchers

#### Fixed
- Set `.js` extensions for all imports so module resolution will
work correctly in node.


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