import GrowthPrediction from "../components/growth/GrowthPrediction";
import DiseaseDetectionPage from "../components/disease/DiseaseDetectionPage";

import FeedingPage from "../components/feeding/FeedingPage";
import FeedingHeader from "../components/feeding/FeedingHeader";
import GrowthPredictionHeader from "../components/growth/GrowthPredictionHeader";
import DiseaseDetectionHeader from "../components/disease/DiseaseDetectionHeader";

import FarmDashboard from "../components/farm/FarmDashboard";
import FarmConditionsHeader from "../components/farm/FarmConditionsHeader";

// export const MODULE_REGISTRY = {
//   "farm-conditions": {
//     Component: FarmDashboard,
//     Header: FarmConditionsHeader,
//   },
//   "growth-monitoring": {
//     Header: GrowthPredictionHeader,
//     Component: GrowthPrediction,
//   },
//   "disease-detection": {
//     Header: DiseaseDetectionHeader,
//     Component: DiseaseDetectionPage,
//   },
//   "feeding": {
//     Header: FeedingHeader,
//     Component: FeedingPage,
//   },
// };

export const MODULE_REGISTRY = {
  "farm-conditions": {
    Component: FarmDashboard,
    title: "Farm Conditions",
    subtitle: "Monitor pond health and environment",
  },
  "growth-monitoring": {
    Component: GrowthPrediction,
    title: "Growth Monitoring",
    subtitle: "AI-powered growth predictions",
  },
  "disease-detection": {
    Component: DiseaseDetectionPage,
    title: "Disease Detection",
    subtitle: "Identify and manage fish diseases",
  },
  "feeding": {
    Component: FeedingPage,
    title: "Smart Feeding System",
    subtitle: "Intelligent feeding & monitoring",
  },
};