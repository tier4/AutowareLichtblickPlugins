import { ExtensionContext } from "@lichtblick/suite";

// Converters
import {
  convertDetectedObjects,
  convertTrackedObjects,
  convertPredictedObjects,
  convertDetectedObjectsWithFeature,
  convertTrafficLightRoiArray,
  PerceptionSettings,
  convertKinematicState,
  LocalizationSettings,
  convertPath,
  convertPathWithLaneId,
  convertTrajectory,
  PathSettings,
  PathWithLaneIdSettings,
  TrajectorySettings,
} from "./converters";

// Panels
import { initDLRDiagnosticsPanel } from "./panels/DLRDiagnosticsPanel";
import { initDLRPlanningFactorPanel } from "./panels/DLRPlanningFactorPanel";
import { initDLRLocalizationPanel } from "./panels/DLRLocalizationPanel";
import { initVehicleInfoPanel } from "./panels/VehicleInfoPanel";

export function activate(extensionContext: ExtensionContext): void {
  // Perception Converters
  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_auto_perception_msgs/msg/PredictedObjects",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertPredictedObjects,
    panelSettings: PerceptionSettings,
  });
  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_perception_msgs/msg/PredictedObjects",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertPredictedObjects,
    panelSettings: PerceptionSettings,
  });

  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_auto_perception_msgs/msg/TrackedObjects",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertTrackedObjects,
    panelSettings: PerceptionSettings,
  });
  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_perception_msgs/msg/TrackedObjects",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertTrackedObjects,
    panelSettings: PerceptionSettings,
  });
  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_auto_perception_msgs/msg/DetectedObjects",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertDetectedObjects,
  });
  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_perception_msgs/msg/DetectedObjects",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertDetectedObjects,
  });
  extensionContext.registerMessageConverter({
    fromSchemaName: "tier4_perception_msgs/msg/DetectedObjectsWithFeature",
    toSchemaName: "foxglove.ImageAnnotations",
    converter: convertDetectedObjectsWithFeature,
  });
  extensionContext.registerMessageConverter({
    fromSchemaName: "tier4_perception_msgs/msg/TrafficLightRoiArray",
    toSchemaName: "foxglove.ImageAnnotations",
    converter: convertTrafficLightRoiArray,
  });

  // Localization Converters
  extensionContext.registerMessageConverter({
    fromSchemaName: "nav_msgs/msg/Odometry",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertKinematicState,
    panelSettings: LocalizationSettings,
  });

  // Planning Converters
  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_planning_msgs/msg/Path",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertPath,
    panelSettings: PathSettings,
  });

  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_internal_planning_msgs/msg/PathWithLaneId",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertPathWithLaneId,
    panelSettings: PathWithLaneIdSettings,
  });

  extensionContext.registerMessageConverter({
    fromSchemaName: "autoware_planning_msgs/msg/Trajectory",
    toSchemaName: "foxglove.SceneUpdate",
    converter: convertTrajectory,
    panelSettings: TrajectorySettings,
  });

  extensionContext.registerPanel({
    name: "DLR Diagnostics",
    initPanel: initDLRDiagnosticsPanel,
  });

  extensionContext.registerPanel({
    name: "DLR Planning Factor",
    initPanel: initDLRPlanningFactorPanel,
  });

  extensionContext.registerPanel({
    name: "DLR Localization Result",
    initPanel: initDLRLocalizationPanel,
  });

  extensionContext.registerPanel({
    name: "Vehicle Info",
    initPanel: initVehicleInfoPanel,
  });
}
