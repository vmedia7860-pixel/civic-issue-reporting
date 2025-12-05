export function dummyClassifier(text = '') {
  const t = text.toLowerCase();
  
  const mapping = [
    { keywords: ['pothole', 'road', 'sinkhole', 'asphalt', 'pavement'], cat: 'Road', priority: 6 },
    { keywords: ['leak', 'water', 'sewer', 'pipeline', 'drainage', 'flood'], cat: 'Water', priority: 8 },
    { keywords: ['electric', 'light', 'streetlight', 'power', 'outage', 'wire'], cat: 'Electricity', priority: 7 },
    { keywords: ['garbage', 'trash', 'dump', 'waste', 'litter', 'bin'], cat: 'Waste', priority: 5 },
    { keywords: ['fire', 'smoke', 'emergency'], cat: 'Emergency', priority: 9 },
    { keywords: ['traffic', 'signal', 'sign', 'parking'], cat: 'Traffic', priority: 4 },
    { keywords: ['tree', 'branch', 'vegetation'], cat: 'Parks', priority: 3 },
  ];

  for (const m of mapping) {
    if (m.keywords.some(k => t.includes(k))) {
      return { 
        category: m.cat, 
        priority: m.priority,
        title: generateTitle(text, m.cat)
      };
    }
  }
  
  return { 
    category: 'General', 
    priority: 3,
    title: text.length > 50 ? text.substring(0, 50) + '...' : text
  };
}

function generateTitle(description, category) {
  const words = description.split(' ').slice(0, 8);
  return `${category} Issue: ${words.join(' ')}`;
}

