export interface AbcMetadata {
  bpm: string;
  key: string;
  meter: string;
}

export function parseAbcMetadata(abc: string): AbcMetadata {
  const metadata: AbcMetadata = {
    bpm: 'AUTO',
    key: 'Detecting',
    meter: '4/4'
  };

  if (!abc) return metadata;

  // Simple regex parsers for ABC fields
  const bpmMatch = abc.match(/Q:\s*(\d+)/);
  if (bpmMatch) metadata.bpm = bpmMatch[1];

  const keyMatch = abc.match(/K:\s*([A-Ga-g#b][^ \n]*)/);
  if (keyMatch) metadata.key = keyMatch[1];

  const meterMatch = abc.match(/M:\s*(\d+\/\d+)/);
  if (meterMatch) metadata.meter = meterMatch[1];

  return metadata;
}
