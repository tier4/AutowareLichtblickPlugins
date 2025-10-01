// autoware_perception_msgs::msg::DetectedObjects
import { Header } from "../base/Header";
import { ClassificationLabel } from "./ClassificationLabel";
import { Point2D } from "../base/Point";
import { Dimensions } from "../base/Dimensions";
import { Pose } from "../base/Pose";
import { Twist } from "../base/Twist";

export type DetectedObjects = {
  header: Header;
  objects: DetectedObject[];
};

export type DetectedObject = {
  existence_probability: number;
  classification: ClassificationLabel[];
  kinematics: {
    pose_with_covariance: {
      pose: Pose;
      covariance: Float64Array;
    };
    has_position_covariance: boolean;
    orientation_probability: number;
    twist_with_covariance: {
      twist: Twist;
      covariance: Float64Array;
    };
    has_twist: boolean;
    has_twist_covariance: boolean;
  };
  shape: {
    type: number;
    footprint: {
      points: Point2D[];
    };
    dimensions: Dimensions;
  };
};
