export interface Candidate {
  formula: string;
  similarity: number;
  carbon_ratio: number;
  formation_energy: number;
  energy_above_hull: number;
  band_gap: number;
  composite_score: number;
}

export interface DftCandidate {
  material_id: string;
  formula: string;
  similarity: number;
  graphene_structure_score: number;
  carbon_fraction: number;
  mean_coordination_number: number;
  cc_bond_length_deviation: number;
  estimated_dimensionality: number;
  formation_energy: number;
  energy_above_hull: number;
  band_gap: number;
  dft_priority_score: number;
}

export interface StructuralCandidate {
  formula: string;
  graphene_structure_score: number;
  carbon_fraction: number;
  mean_coordination_number: number;
  cc_bond_length_deviation: number;
  estimated_dimensionality: number;
}

export interface PcaPoint {
  material_id: string;
  formula: string;
  similarity: number;
  PC1: number;
  PC2: number;
  is_top?: boolean;
}

export interface PcaDataset {
  graphene_reference: {
    formula: string;
    PC1: number;
    PC2: number;
    similarity: number;
  };
  explained_variance: {
    PC1: number;
    PC2: number;
    cumulative: number;
  };
  points: PcaPoint[];
}

export interface TrainingEpoch {
  epoch: number;
  train_loss: number;
  val_loss: number;
  lr: number;
  is_best: boolean;
}

export interface MaterialExplorerItem {
  material_id: string;
  formula: string;
  similarity: number;
  formation_energy: number;
  energy_above_hull: number;
  band_gap: number;
  carbon_fraction: number;
  coordination_number: number;
  graphene_score: number;
  dimensionality: number;
  dft_priority: number;
  status: string;
}

export interface CrystalAtom {
  id: number;
  element: string;
  color: string;
  radius: number;
  x: number;
  y: number;
  z: number;
}

export interface CrystalPreset {
  name: string;
  formula: string;
  system: string;
  description: string;
  similarity: number;
  band_gap: string;
  coordination: number;
  atoms: CrystalAtom[];
  bonds: number[][];
}

export interface StatsSummary {
  total_materials: number;
  with_structure: number;
  train_samples: number;
  val_samples: number;
  best_val_loss: number;
  initial_loss: number;
  element_features_dim: number;
  transformer_depth: number;
  transformer_heads: number;
  embedding_dim: number;
  pca_variance_pc1: number;
  pca_variance_pc2: number;
  pca_variance_total: number;
  graphene_ref_pc1: number;
  graphene_ref_pc2: number;
}
