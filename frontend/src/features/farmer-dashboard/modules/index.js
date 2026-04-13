import GrowthPrediction from "../modules/GrowthPrediction";
import DiseaseDetectionPage from "../../../pages/DiseaseDetectionPage";

import FeedingPage from "../../../pages/FeedingPage";
import FeedingHeader from "../../../components/feeding/FeedingHeader";
import GrowthPredictionHeader from "./GrowthPredictionHeader";
import DiseaseDetectionHeader from "./DiseaseDetectionHeader";

export const MODULE_REGISTRY = {
  "growth-monitoring": {
    Header: GrowthPredictionHeader,
    Component: GrowthPrediction,
  },
  "disease-detection": {
    Header: DiseaseDetectionHeader,
    Component: DiseaseDetectionPage,
  },
  "feeding": {
    Header: FeedingHeader,
    Component: FeedingPage,
  },
};