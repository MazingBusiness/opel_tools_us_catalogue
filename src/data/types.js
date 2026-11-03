// Every product model belongs to exactly one product type. Type slugs are URLs, so a product can be
// renamed freely but a slug must not change. `npm run check:types` fails if a product has no type.
export const TYPES = [
  { category: 'POWER TOOLS', slug: 'angle-grinders', label: 'Angle Grinders', models: ['5229', '5301', '5304', '5305', '5221', '5308'] },
  { category: 'POWER TOOLS', slug: 'marble-cutters', label: 'Marble Cutters', models: ['5311', '5307', '5312', '5231', '5230', '5232', '5204'] },
  { category: 'POWER TOOLS', slug: 'drills-and-drivers', label: 'Drills & Drivers', models: ['5316', '5340', '5310', '5339', '5337'] },
  { category: 'POWER TOOLS', slug: 'rotary-hammers', label: 'Rotary Hammers', models: ['5222', '5206', '5223', '5341', '5342'] },
  { category: 'POWER TOOLS', slug: 'demolition-hammers', label: 'Demolition Hammers', models: ['5214', '5211', '5210', '5207', '5209', '5360', '5364', '5363', '5361', '5362'] },
  { category: 'POWER TOOLS', slug: 'saws-and-cutters', label: 'Saws & Cutters', models: ['5327', '5326', '5215', '5392', '5391'] },
  { category: 'POWER TOOLS', slug: 'concrete-vibrators', label: 'Concrete Vibrators', models: ['5225', '5228', '5336', '5335'] },
  { category: 'POWER TOOLS', slug: 'planers-and-polishers', label: 'Planers & Polishers', models: ['5394', '5333', '5334', '5233', '5393'] },
  { category: 'POWER TOOLS', slug: 'blowers-and-heat-guns', label: 'Blowers & Heat Guns', models: ['5332', '5330', '5331', '5387', '5329'] },
  { category: 'POWER TOOLS', slug: 'bench-tools', label: 'Bench Tools', models: ['5218', '5219', '5322', '5323', '5319'] },

  { category: 'CORDLESS TOOLS', slug: 'drills', label: 'Drills', models: ['5238', '5239', '5349', '5347', '5348'] },
  { category: 'CORDLESS TOOLS', slug: 'impact-and-ratchet-wrenches', label: 'Impact & Ratchet Wrenches', models: ['5234', '5235', '5236', '5346', '5246'] },
  { category: 'CORDLESS TOOLS', slug: 'angle-grinders', label: 'Angle Grinders', models: ['5240', '5241'] },
  { category: 'CORDLESS TOOLS', slug: 'rotary-hammers', label: 'Rotary Hammers', models: ['5242'] },
  { category: 'CORDLESS TOOLS', slug: 'vibrators', label: 'Vibrators', models: ['5247', '5248', '5249'] },
  { category: 'CORDLESS TOOLS', slug: 'outdoor-tools', label: 'Outdoor Tools', models: ['5243', '5245', '5244', '5377'] },

  { category: 'PAINTING EQUIPMENTS', slug: 'spray-guns', label: 'Spray Guns', models: ['5313', '5314', '5315', '5227', '92-08', '92-01', '92-02', '92-03'] },
  { category: 'PAINTING EQUIPMENTS', slug: 'mixers', label: 'Mixers', models: ['5398'] },
  { category: 'PAINTING EQUIPMENTS', slug: 'screed-pumps-and-line-markers', label: 'Screed Pumps & Line Markers', models: ['92-05', '92-06', '92-07'] },

  { category: 'CLEANING EQUIPMENTS', slug: 'pressure-washers', label: 'Pressure Washers', models: ['B18', '5226', '5365', 'S3000', 'S2300'] },
  { category: 'AGRICULTURE EQUIPMENTS', slug: 'chainsaws', label: 'Chainsaws & Chains', models: ['5203', '5325', '5324', '5317'] },
  { category: 'PNEUMATIC EQUIPMENTS', slug: 'air-compressors', label: 'Air Compressors', models: ['5205', '5358', '5372'] },
  { category: 'WELDING EQUIPMENTS', slug: 'welding-machines', label: 'Welding Machines', models: ['5250', '5251', '5252', '5253'] },
  { category: 'POWER TOOLS ACCESSORIES', slug: 'door-mortisers', label: 'Door Mortisers', models: ['DM200'] },
]
