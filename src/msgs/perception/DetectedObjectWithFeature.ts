import { Header } from "../base/Header";
import { PointCloud2 } from "../base/PointCloud2";
import { RegionOfInterest } from "../base/RegionOfInterest";
import { DetectedObject } from "../perception/DetectedObjects";

export type DetectedObjectsWithFeature = {
    header: Header;
    feature_objects: DetectedObjectWithFeature[];
}

export type DetectedObjectWithFeature = {
    object: DetectedObject;
    feature: Feature;
}

export type Feature = {
  cluster: PointCloud2;
  roi: RegionOfInterest;
};