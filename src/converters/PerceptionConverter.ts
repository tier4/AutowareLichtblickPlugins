import {
  CubePrimitive,
  SceneUpdate,
  SpherePrimitive,
  LinePrimitive,
  TextPrimitive,
  ImageAnnotations,
  PointsAnnotation,
  PointsAnnotationType,
  TextAnnotation,
} from "@foxglove/schemas";
import { PredictedObjects } from "../msgs/perception/PredictedObjects";
import { TrackedObjects } from "../msgs/perception/TrackedObjects";
import { DetectedObjects } from "../msgs/perception/DetectedObjects";
import { DetectedObjectsWithFeature } from "../msgs/perception/DetectedObjectWithFeature";
import { TrafficLightRoiArray } from "../msgs/perception/TrafficLightRoi";
import { Header } from "../msgs/base/Header";
import { Point } from "../msgs/base/Point";
import { Orientation } from "../msgs/base/Orientation";
import { Dimensions } from "../msgs/base/Dimensions";
import { Immutable, MessageEvent } from "@lichtblick/suite";

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

interface PerceptionGUISettings {
  viewPathObjectId: string;
}

export const PerceptionSettings: Record<string, any> = {
  "3D": {
    settings: (config?: unknown) => ({
      fields: {
        viewPathObjectId: {
          label: "View Object ID",
          input: "toggle",
          value: (config as PerceptionGUISettings)?.viewPathObjectId ?? "Off",
          options: ["Off", "On"],
          help: "Show/hide object ID text",
        },
      },
    }),
    handler: () => {},
    defaultConfig: {},
  },
};

const colorMap: Record<number, Color> = {
  0: { r: 1.0, g: 1.0, b: 1.0, a: 0.5 }, // UNKNOWN // white // hex: #FFFFFF
  1: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 }, // CAR // red // hex: #FF0000
  2: { r: 1.0, g: 0.5, b: 0.5, a: 0.5 }, // BICYCLE // pink // hex: #FF8080
  3: { r: 0.0, g: 0.5, b: 1.0, a: 0.5 }, // BUS // blue // hex: #0080FF
  4: { r: 0.0, g: 0.5, b: 1.0, a: 0.5 }, // TRUCK // blue // hex: #0080FF
  5: { r: 1.0, g: 0.5, b: 0.5, a: 0.5 }, // CYCLIST // pink // hex: #FF8080
  6: { r: 1.0, g: 1.0, b: 0.5, a: 0.5 }, // MOTORCYCLE // yellow // hex: #FFFF80
  7: { r: 0.75, g: 1.0, b: 0.25, a: 0.5 }, // PEDESTRIAN // green // hex: #BFFF40
};

const trafficLightColorMap: Record<number, Color> = {
  0: { r: 0.0, g: 1.0, b: 0.0, a: 1.0 }, // CAR_TRAFFIC_LIGHT // red // hex: #00FF00
  1: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 }, // PEDESTRIAN_TRAFFIC_LIGHT // yellow // hex: #FFFF00
};

enum Classification {
  UNKNOWN = 0,
  CAR = 1,
  BICYCLE = 2,
  BUS = 3,
  TRUCK = 4,
  CYCLIST = 5,
  MOTORCYCLE = 6,
  PEDESTRIAN = 7,
}

const classificationNameMap: Record<number, string> = {
  0: "UNKNOWN",
  1: "CAR",
  2: "TRUCK",
  3: "BUS",
  4: "BICYCLE",
  5: "MOTORBIKE",
  6: "PEDESTRIAN",
  7: "ANIMAL",
};

const trafficLightNameMap: Record<number, string> = {
  0: "VehicleTL",
  1: "PedestrianTL",
};

function createSceneUpdateMessage(
  header: Header,
  spheres: SpherePrimitive[],
  cubes: CubePrimitive[],
  lines: LinePrimitive[] = [],
  texts: TextPrimitive[] = []
): SceneUpdate {
  return {
    deletions: [],
    entities: [
      {
        id: spheres.length > 0 ? "predicted_objects" : "detected_objects",
        timestamp: header.stamp,
        frame_id: header.frame_id,
        frame_locked: false,
        lifetime: { sec: 1, nsec: 0 },
        metadata: [],
        arrows: [],
        cylinders: [],
        lines: lines,
        spheres: spheres,
        texts: texts,
        triangles: [],
        models: [],
        cubes: cubes,
      },
    ],
  };
}

function createCubePrimitive(
  position: Point,
  orientation: Orientation,
  color: Color,
  dimensions: Dimensions
): CubePrimitive {
  return {
    color,
    size: { x: dimensions.x, y: dimensions.y, z: dimensions.z },
    pose: {
      position: {
        x: position.x,
        y: position.y,
        // make the cube start at the ground level (z = 0)
        z: position.z - 0.5 * dimensions.z,
      },
      orientation,
    },
  };
}

function roiToPolyline(
  x: number,
  y: number,
  w: number,
  h: number
): Array<{ x: number; y: number }> {
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
    { x, y }, // close
  ];
}

export function convertDetectedObjects(msg: DetectedObjects): SceneUpdate {
  const { header, objects } = msg;

  const cubePrimitives: CubePrimitive[] = objects.reduce((acc: CubePrimitive[], object) => {
    const { kinematics, shape, classification } = object;
    const { pose_with_covariance } = kinematics;
    const { position, orientation } = pose_with_covariance.pose;
    const { dimensions } = shape;

    if (
      classification.length === 0 ||
      !classification[0] ||
      classification[0].label === undefined
    ) {
      return acc;
    }

    const { label } = classification[0];
    const color = colorMap[label as keyof typeof colorMap] ?? { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

    const predictedObjectCube: CubePrimitive = createCubePrimitive(
      position,
      orientation,
      color,
      dimensions
    );

    acc.push(predictedObjectCube);
    return acc;
  }, []);

  return createSceneUpdateMessage(header, [], cubePrimitives, []);
}

export function convertTrackedObjects(
  msg: TrackedObjects,
  event: Immutable<MessageEvent<TrackedObjects>>
): SceneUpdate {
  const guiSettings = event.topicConfig as PerceptionGUISettings;
  const { header, objects } = msg;

  const cubePrimitives: CubePrimitive[] = [];
  const textPrimitives: TextPrimitive[] = [];

  objects.forEach(object => {
    const { object_id, kinematics, shape, classification } = object;
    const { pose_with_covariance } = kinematics;
    const { position, orientation } = pose_with_covariance.pose;
    const { dimensions } = shape;

    if (
      classification.length === 0 ||
      !classification[0] ||
      classification[0].label === undefined
    ) {
      return;
    }

    const { label } = classification[0];
    const color = colorMap[label as keyof typeof colorMap] ?? { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

    const predictedObjectCube: CubePrimitive = createCubePrimitive(
      position,
      orientation,
      color,
      dimensions
    );

    cubePrimitives.push(predictedObjectCube);

    if (guiSettings?.viewPathObjectId === "On") {
      const objectIdHex = Array.from(object_id.uuid)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

      const textPrimitive: TextPrimitive = {
        pose: {
          position: {
            x: position.x,
            y: position.y,
            z: position.z + dimensions.z / 2 + 0.5,
          },
          orientation: { x: 0, y: 0, z: 0, w: 1 },
        },
        billboard: true,
        font_size: 0.3,
        scale_invariant: false,
        color: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
        text: objectIdHex.substring(0, 8),
      };

      textPrimitives.push(textPrimitive);
    }
  });

  return createSceneUpdateMessage(header, [], cubePrimitives, [], textPrimitives);
}

export function convertPredictedObjects(
  msg: PredictedObjects,
  event: Immutable<MessageEvent<PredictedObjects>>
): SceneUpdate {
  const guiSettings = event.topicConfig as PerceptionGUISettings;
  const { header, objects } = msg;

  // create lines for predicted paths - dashed line effect
  const linePrimitives: LinePrimitive[] = objects.reduce((acc: LinePrimitive[], object) => {
    const { kinematics, classification } = object;
    const { initial_pose_with_covariance, predicted_paths } = kinematics;

    if (
      classification.length === 0 ||
      !classification[0] ||
      classification[0].label === undefined
    ) {
      return acc;
    }

    const { label } = classification[0];
    const color = colorMap[label as keyof typeof colorMap] ?? { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

    // if the object is not unknown and has a predicted path, draw the first 3 paths
    if (
      label !== Classification.UNKNOWN &&
      Math.floor(initial_pose_with_covariance.pose.position.x) > 0
    ) {
      // Display first 3 predicted paths as dashed lines (if available)
      const pathsToShow = Math.min(3, predicted_paths.length);
      const alphaValues = [0.7, 0.3, 0.1]; // Transparency for each path

      for (let pathIndex = 0; pathIndex < pathsToShow; pathIndex++) {
        const pathPoints = predicted_paths[pathIndex]!.path;
        const pathColor = {
          ...color,
          a: alphaValues[pathIndex]!,
        };

        // Create line segments: 1-2, 3-4, 5-6, etc. (skip every other connection)
        for (let i = 0; i < pathPoints.length - 1; i += 2) {
          const line: LinePrimitive = {
            type: 0, // LINE_LIST type - individual line segments
            pose: {
              position: { x: 0, y: 0, z: 0 },
              orientation: { x: 0, y: 0, z: 0, w: 1 },
            },
            thickness: 0.1,
            scale_invariant: false,
            color: pathColor,
            colors: [],
            points: [pathPoints[i]!.position, pathPoints[i + 1]!.position],
            indices: [],
          };
          acc.push(line);
        }
      }
    }
    return acc;
  }, []);

  const cubePrimitives: CubePrimitive[] = [];
  const textPrimitives: TextPrimitive[] = [];

  objects.forEach(object => {
    const { object_id, kinematics, shape, classification } = object;
    const { initial_pose_with_covariance } = kinematics;
    const { position, orientation } = initial_pose_with_covariance.pose;
    const { dimensions } = shape;

    if (
      classification.length === 0 ||
      !classification[0] ||
      classification[0].label === undefined
    ) {
      return;
    }

    const { label } = classification[0];
    const color = colorMap[label as keyof typeof colorMap] ?? { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

    const predictedObjectCube: CubePrimitive = createCubePrimitive(
      position,
      orientation,
      color,
      dimensions
    );

    cubePrimitives.push(predictedObjectCube);

    if (guiSettings?.viewPathObjectId === "On") {
      const objectIdHex = Array.from(object_id.uuid)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

      const textPrimitive: TextPrimitive = {
        pose: {
          position: {
            x: position.x,
            y: position.y,
            z: position.z + dimensions.z / 2 + 0.5,
          },
          orientation: { x: 0, y: 0, z: 0, w: 1 },
        },
        billboard: true,
        font_size: 0.3,
        scale_invariant: false,
        color: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
        text: objectIdHex.substring(0, 8),
      };

      textPrimitives.push(textPrimitive);
    }
  });

  return createSceneUpdateMessage(header, [], cubePrimitives, linePrimitives, textPrimitives);
}

export function convertDetectedObjectsWithFeature(
  msg: DetectedObjectsWithFeature
): ImageAnnotations {
  const anns: ImageAnnotations = { circles: [], points: [], texts: [] };

  for (const object of msg.feature_objects ?? []) {
    const roi = object.feature?.roi;
    if (!roi) continue;

    if (
      object.object.classification.length === 0 ||
      !object.object.classification[0] ||
      object.object.classification[0].label === undefined
    ) {
      continue;
    }

    // ROS RegionOfInterest uses x_offset/y_offset + width/height
    const x = roi.x_offset;
    const y = roi.y_offset;
    const w = roi.width;
    const h = roi.height;

    const { label } = object.object.classification[0];
    const labelStr =
      classificationNameMap[label as keyof typeof classificationNameMap] || "UNKNOWN";
    const color = colorMap[label as keyof typeof colorMap] ?? { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
    color.a = 0.8; // make it more opaque for 2D outline
    const fill_color = { ...color, a: 0.2 }; // more transparent fill color
    const score = object.object.existence_probability;

    // Draw rectangle as a polyline (or switch to POLYGON if you want it filled)
    const poly: PointsAnnotation = {
      timestamp: msg.header.stamp,
      type: PointsAnnotationType.LINE_LOOP,
      thickness: 4,
      outline_color: color,
      outline_colors: [],
      fill_color: fill_color,
      points: roiToPolyline(x, y, w, h),
    };
    anns.points!.push(poly);

    // Optional: label text from the first classification
    const cls = object.object.classification[0];
    if (cls) {
      const txt: TextAnnotation = {
        timestamp: msg.header.stamp,
        position: { x, y: Math.max(0, y - 6) },
        text: `${labelStr}: ${score.toFixed(2)}`,
        text_color: color,
        background_color: { r: 0, g: 0, b: 0, a: 0.5 },
        font_size: 14,
      };
      anns.texts!.push(txt);
    }
  }

  return anns;
}

export function convertTrafficLightRoiArray(msg: TrafficLightRoiArray): ImageAnnotations {
  const anns: ImageAnnotations = { circles: [], points: [], texts: [] };

  for (const tl of msg.rois ?? []) {
    const roi = tl.roi;
    if (!roi) continue;

    const x = roi.x_offset;
    const y = roi.y_offset;
    const w = roi.width;
    const h = roi.height;

    const typeStr =
      trafficLightNameMap[tl.traffic_light_type as keyof typeof trafficLightNameMap] ??
      "TrafficLight";
    const color = trafficLightColorMap[tl.traffic_light_type as keyof typeof colorMap] ?? {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0,
    };
    const fill_color = { ...color, a: 0.2 }; // more transparent fill color
    // 2D box as a closed loop
    const poly: PointsAnnotation = {
      timestamp: msg.header.stamp,
      type: PointsAnnotationType.LINE_LOOP,
      thickness: 4,
      outline_color: color,
      outline_colors: [],
      fill_color: fill_color,
      points: roiToPolyline(x, y, w, h),
    };
    anns.points!.push(poly);

    // label above the box (id + type)
    const label: TextAnnotation = {
      timestamp: msg.header.stamp,
      position: { x, y: Math.max(0, y - 6) },
      text: `TL:${tl.traffic_light_id} ${typeStr}`,
      text_color: color,
      background_color: { r: 0, g: 0, b: 0, a: 0.5 },
      font_size: 14,
    };
    anns.texts!.push(label);
  }

  return anns;
}

export type { PerceptionGUISettings };
