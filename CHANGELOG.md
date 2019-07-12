# Change Log

All notable changes to the "centroid-plc" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2019-07-12

### Changed

- Updated dependencies

## [0.4] - 2019-03-30

### Added

- Added real parser and lexer for Centroid PLC code

### Changed

- Use parser to more accurately identify stages and other info

## [0.3.6] - 2019-03-23

### Added

- Basic document formatter - currently only proper-cases keywords

## [0.3.5] - 2019-03-21

### Fixed

- Syntax highlighting improved

## [0.3.4] - 2019-03-18

### Fixed

- W type symbols were broken in some cases.

## [0.3.3] - 2019-03-18

### Fixed

- Make go to definition jump to declaration if there is no possible definition.

## [0.3.1] - 2019-03-17

### Added

- Handle aliases of system variables

### Fixed

- Handle named but undefined stages

## [0.3.0] - 2019-03-16

### Added

- Go to definition for stages
- Outlining for stages

### Fixed

- Highlighting for true/false

## [0.2.1] - 2019-03-11

### Fixed

- A bug in a script caused some system variable documentation to go missing in the prior release

## [0.2.0] - 2019-03-10

### Added

- Hover for symbol info
- Go to declaration
- Find all references
- Context aware code completion
- Documentation for all machine parameters and system parameters

### Changed

- Some small syntax highlighting bugs were fixed

## [0.1.0] - 2019-02-21

- Initial release that has just syntax highlighting.
