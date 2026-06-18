import * as tf from '@tensorflow/tfjs';

let trainedModel = null;

const neighborhoodMap = {
  'Tarred Malingo': 0.8, 'Bulu': 0.7, 'Small Soppo': 0.6, 'Sandpit': 0.75, 
  'Mayor Street': 0.85, 'Dirty South': 0.5, 'Muea': 0.55, 'Bonduma': 0.8, 
  'Molyko': 1.0, 'Mile16': 0.6, 'Siac': 0.65, 'UB south area': 0.9, 
  'Cogeni': 0.8, 'Biaka/SantaBabara': 0.85, 'Ub junction': 0.95, 
  'Bakweri Town': 0.6, 'Mile18': 0.5, 'Muea Control': 0.5, 'Mile17': 0.8, 
  'CCA': 0.7, 'Ndongo': 0.4, 'Bomaka': 0.4, 'Memoz': 0.7, 
  'Check Point': 0.75, 'Bakweri': 0.5, 'Mille 18': 0.5
};
const typeMap = { 'Family Home': 1.0, 'Apartment / Studio': 0.7, 'Student Hostel': 0.5, 'Commercial': 1.2, 'Apartment': 0.8, 'Studio': 0.6, 'Self-Contained Room': 0.5, 'RKT': 0.5 };
const uniMap = { 'Walking distance (<500m)': 1.0, 'Near (500m–2km)': 0.7, 'Far (>2km)': 0.4 };

export function encodeFeatures(data, isRawProperty = false) {
  // If it's a raw property from mockProperties, map it to the expected inputs
  let bedrooms = data.bedrooms || 1;
  let bathrooms = data.bathrooms || 1;
  let hasWater = isRawProperty ? (data.waterSupply && data.waterSupply.toLowerCase() !== 'no') : data.hasWater;
  let hasFence = data.hasFence;
  let hasGuard = data.hasGuard;
  let uni = isRawProperty ? 'Walking distance (<500m)' : data.universityProximity;
  let type = isRawProperty ? data.type : data.propertyType;
  let neighborhood = data.neighborhood;

  return [
    bedrooms / 5, 
    bathrooms / 4,
    hasWater ? 1 : 0,
    hasFence ? 1 : 0,
    hasGuard ? 1 : 0,
    uniMap[uni] || 0.5,
    typeMap[type] || 0.6,
    neighborhoodMap[neighborhood] || 0.5,
  ];
}

export async function trainModel(dataset) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [8], units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

  // Prepare tensors
  const inputs = [];
  const labels = [];
  
  dataset.forEach(prop => {
    if(prop.currentPrice && prop.currentPrice > 0) {
      inputs.push(encodeFeatures(prop, true));
      // Normalize price by dividing by 100,000 for better training
      labels.push([prop.currentPrice / 100000]);
    }
  });

  const xs = tf.tensor2d(inputs);
  const ys = tf.tensor2d(labels);

  await model.fit(xs, ys, {
    epochs: 150,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 50 === 0) console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      }
    }
  });

  trainedModel = model;
  xs.dispose();
  ys.dispose();
  return model;
}

export function predictPrice(formData, isRawProperty = false) {
  const features = encodeFeatures(formData, isRawProperty);
  
  // Calculate confidence based on features
  const [beds, baths, water, fence, guard, uni, type, neighborhood] = features;
  const confidence = Math.min(95, 60 + neighborhood * 20 + (water + fence + guard) * 5);

  let finalPrice = 0;

  if (trainedModel) {
    // Truly use the TensorFlow model
    const tensor = tf.tensor2d([features]);
    const prediction = trainedModel.predict(tensor);
    const predictedValue = prediction.dataSync()[0];
    tensor.dispose();
    prediction.dispose();
    
    // Denormalize the price (multiply by 100,000)
    finalPrice = predictedValue * 100000;
  } else {
    // Fallback heuristic if model isn't trained yet
    finalPrice = 30000 + (beds * 50000) + (water * 10000) + (neighborhood * 30000);
  }

  // Ensure reasonable bounds
  if (finalPrice < 15000) finalPrice = 15000;
  
  return {
    price: Math.round(finalPrice / 500) * 500, // Round to nearest 500
    confidence: Math.round(confidence),
    range: {
      low: Math.round(finalPrice * 0.85 / 500) * 500,
      high: Math.round(finalPrice * 1.15 / 500) * 500,
    }
  };
}
