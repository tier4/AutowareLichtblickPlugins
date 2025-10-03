# AutowareLichtblickPlugins

An extension for Foxglove Studio/Lichtblick that provides Autoware message converters, panels, and layouts for visualing and debugging rosbags.

Special thanks to [https://github.com/kminoda/AutowareFoxgloveConverter](https://github.com/kminoda/AutowareFoxgloveConverter) for the inspiration and the code to get started.

## Features

### Supported Message Converters

- **3D Perception:**

  - [autoware_auto_perception_msgs::msg::DetectedObjects](https://github.com/tier4/autoware_auto_msgs/blob/tier4/main/autoware_auto_perception_msgs/msg/DetectedObjects.idl)
  - [autoware_auto_perception_msgs::msg::TrackedObjects](https://github.com/tier4/autoware_auto_msgs/blob/tier4/main/autoware_auto_perception_msgs/msg/TrackedObjects.idl)
  - [autoware_auto_perception_msgs::msg::PredictedObjects](https://github.com/tier4/autoware_auto_msgs/blob/tier4/main/autoware_auto_perception_msgs/msg/PredictedObjects.idl)
  - [autoware_perception_msgs::msg::DetectedObjects](https://github.com/autowarefoundation/autoware_msgs/blob/main/autoware_perception_msgs/msg/DetectedObjects.msg)
  - [autoware_perception_msgs::msg::TrackedObjects](https://github.com/autowarefoundation/autoware_msgs/blob/main/autoware_perception_msgs/msg/TrackedObjects.msg)
  - [autoware_perception_msgs::msg::PredictedObjects](https://github.com/autowarefoundation/autoware_msgs/blob/main/autoware_perception_msgs/msg/PredictedObjects.msg)

- **2D Perception:**

  - [tier4_perception_msgs::msg::DetectedObjectsWithFeature](https://github.com/tier4/tier4_autoware_msgs/blob/tier4/universe/tier4_perception_msgs/msg/object_recognition/DetectedObjectsWithFeature.msg)
  - [tier4_perception_msgs::msg::TrafficLightRoiArray](https://github.com/tier4/tier4_autoware_msgs/blob/tier4/universe/tier4_perception_msgs/msg/traffic_light/TrafficLightRoiArray.msg)

- **Localization:**

  - [nav_msgs::msg::Odometry](https://docs.ros2.org/foxy/api/nav_msgs/msg/Odometry.html)

- **Planning:**

  - [autoware_planning_msgs::msg::Path](https://github.com/autowarefoundation/autoware_msgs/blob/main/autoware_planning_msgs/msg/Path.msg)
  - [autoware_internal_planning_msgs::msg::PathWithLaneId](https://github.com/autowarefoundation/autoware_internal_msgs/blob/main/autoware_internal_planning_msgs/msg/PathWithLaneId.msg)
  - [autoware_planning_msgs::msg::Trajectory](https://github.com/autowarefoundation/autoware_msgs/blob/main/autoware_planning_msgs/msg/Trajectory.msg)

### Available Panels

- **DLR Diagnostics Result**: Display diagnostic condition results of [DrivingLogReplayerv2](https://github.com/tier4/driving_log_replayer_v2)
- **DLR PlanningFactor Result** Display planning factor condition results for `planning_control` of [DrivingLogReplayerv2](https://github.com/tier4/driving_log_replayer_v2)
- **DLR Localization Result** Display localization results of [DrivingLogReplayerv2](https://github.com/tier4/driving_log_replayer_v2)
- **Vehicle Config**: Select a vehicle to display the ego vehicle

### Available Layouts

- [DLR_localization](./layouts/DLR_localization.json) - layout for `localization` DLR tests
- [DLR_planning_control](./layouts/DLR_planning_control.json) - layout for `planning_control` DLR tests
- [ScenarioSimulator](./layouts/ScenarioSimulator.json) - layout for ScenarioSimulator_v2
- [DLR_perception_j6gen2](./layouts/DLR_perception_j6gen2.json) - layout for `perception` DLR tests of j6gen2 vehicles
- [DLR_obstalce_segmentation](./layouts/DLR_obstalce_segmentation.json) - layout for `obstacle_segmentation` DLR tests of j6gen2 vehicles

## Installation

```bash
git clone https://github.com/tier4/AutowareLichtblickPlugins.git
cd AutowareLichtblickPlugins
bash ./install.sh
```

## Usage

1. Launch Lichtblick after installation
2. Visualize your rosbag with the `DLRLayout` layout.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## TODO List

- Converter for planning_factor.
- Import vehicle info from json config.
- Make different color for each kind of perception object bounding box, use different box for each topics.
- Display speed and other attribute of bounding boxes.
- Show 2D detection results in images
- Implement a panel to filter bounding box visualization with uuid.

---

---

## _A Foxglove Studio Extension_

[Foxglove Studio](https://github.com/foxglove/studio) allows developers to create extensions, or custom code that is loaded and executed inside the Foxglove Studio application. This can be used to add custom panels. Extensions are authored in TypeScript using the `@foxglove/studio` SDK.

## Develop

Extension development uses the `yarn` package manager to install development dependencies and run build scripts.

To install extension dependencies, run `yarn` from the root of the extension package.

```sh
yarn install
```

To build and install the extension into your local Foxglove Studio desktop app, run:

```sh
yarn run local-install
```

Open the `Foxglove Studio` desktop (or `ctrl-R` to refresh if it is already open). Your extension is installed and available within the app.

## Package

Extensions are packaged into `.foxe` files. These files contain the metadata (package.json) and the build code for the extension.

Before packaging, make sure to set `name`, `publisher`, `version`, and `description` fields in _package.json_. When ready to distribute the extension, run:

```sh
yarn run package
```

This command will package the extension into a `.foxe` file in the local directory.

## Publish

You can publish the extension for the public marketplace or privately for your organization.

See documentation here: https://foxglove.dev/docs/studio/extensions/publish#packaging-your-extension
