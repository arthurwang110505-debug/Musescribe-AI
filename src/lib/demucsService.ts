import { Client } from '@gradio/client';

export interface Stems {
  vocals: string;
  drums: string;
  bass: string;
  other: string;
}

export async function separateStems(file: File): Promise<Stems> {
  // Using a public Hugging Face space for Demucs
  const client = await Client.connect("m-bain/demucs");
  
  const result = await client.predict("/predict", {
    audio: file,
    model: "htdemucs",
    stems: ["drums", "bass", "other", "vocals"]
  });

  // The result from Gradio usually contains URLs to the generated files
  // We need to parse it based on the specific space's output format
  const data = result.data as any[];
  
  return {
    drums: data[0].url,
    bass: data[1].url,
    other: data[2].url,
    vocals: data[3].url,
  };
}
