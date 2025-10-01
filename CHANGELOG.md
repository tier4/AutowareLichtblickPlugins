# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2025-10-01

### Added
- 2D ROI (Region of Interest) support for perception visualization
- TrafficLightRoi and TrafficLightRoiArray message converters
- DetectedObjectWithFeature support for enhanced object detection
- RELEASE.md guide for manual version management
- Enhanced layout configurations for DLR tests

### Fixed
- Project configuration cleanup
- Package.json syntax issues

## [0.1.0] - 2025-10-01

### Added

- Initial release of AutowareLichtblickPlugins
- Message converters for Autoware perception, localization, and planning messages
- DLR Diagnostics Result panel for DrivingLogReplayerv2
- DLR PlanningFactor Result panel for planning_control tests
- DLR Localization Result panel for localization tests
- Vehicle Config panel for ego vehicle display
- Pre-configured layouts for DLR tests and ScenarioSimulator
- Support for both autoware_auto_msgs and autoware_msgs message types
- Yarn package manager support
- Apache-2.0 license

### Features

- **Perception Converters**: DetectedObjects, TrackedObjects, PredictedObjects
- **Localization Converters**: Odometry
- **Planning Converters**: Path, PathWithLaneId, Trajectory
- **Layouts**: DLR_localization, DLR_planning_control, DLR_perception_j6gen2, ScenarioSimulator

### Technical

- Built with TypeScript and React
- Uses Foxglove Studio extension framework
- Compatible with Lichtblick and Foxglove Studio
- Support for object ID visualization
- 3D bounding box display for predicted objects
- Path and trajectory visualization
