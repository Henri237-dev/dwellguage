import * as tf from '@tensorflow/tfjs';
import { mockProperties } from '../src/data/mockProperties.js';
import { trainModel, predictPrice, encodeFeatures } from '../src/ml/model.js';

async function run() {
  console.log("Training model...");
  await trainModel(mockProperties);
  console.log("Training complete!");

  const testProps = [
    { propertyType: 'Apartment', bedrooms: 2, bathrooms: 2, hasWater: true, hasFence: true, hasGuard: true, universityProximity: 'Walking distance (<500m)', neighborhood: 'Bonduma' },
    { propertyType: 'Studio', bedrooms: 1, bathrooms: 1, hasWater: true, hasFence: true, hasGuard: false, universityProximity: 'Near (500m–2km)', neighborhood: 'Molyko' },
    { propertyType: 'Self-Contained Room', bedrooms: 1, bathrooms: 1, hasWater: true, hasFence: false, hasGuard: false, universityProximity: 'Walking distance (<500m)', neighborhood: 'Dirty South' }
  ];

  testProps.forEach((p, i) => {
    const res = predictPrice(p);
    console.log(`Test ${i + 1} (${p.propertyType} in ${p.neighborhood}): predicted = ${res.price}, confidence = ${res.confidence}`);
  });
}

run().catch(console.error);
