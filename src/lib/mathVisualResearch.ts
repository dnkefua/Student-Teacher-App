import { AnimationMode } from './eisMypMathCourse';

export type VisualResearchBlueprint = {
  animation: AnimationMode;
  researchBasis: string[];
  diagrams: string[];
  interactions: string[];
  threeDModels: string[];
  cinematicScenes: string[];
  teacherMoves: string[];
};

export const mathVisualResearchRegistry: Record<AnimationMode, VisualResearchBlueprint> = {
  'number-line': {
    animation: 'number-line',
    researchBasis: [
      'Number lines connect integers, fractions and decimals as positions on one continuous scale.',
      'Fraction strips and decimal grids make equivalent rational quantities visible before symbols are compared.',
      'Directed movement from zero supports integer operations and magnitude reasoning.',
    ],
    diagrams: ['Horizontal number line with zero anchor', 'Zoomed decimal tick marks', 'Fraction strips aligned to the same unit', 'Decimal hundred grid', 'Positive and negative movement arrows'],
    interactions: ['Tap a point on the number line', 'Drag a rational-number card to its position', 'Match fraction, decimal and mixed-number cards', 'Predict the landing point after an integer operation'],
    threeDModels: ['Glowing number-line rail', 'Integer towers rising right and left from zero', 'Stacked fraction-strip platforms', 'Decimal grid floor made of 100 tiles'],
    cinematicScenes: ['Number system universe opens', 'Integer motion from zero', 'Decimal grid zoom', 'Fraction strip bridge', 'Conversion lab', 'Operation journey'],
    teacherMoves: ['Ask what zero is doing in the model', 'Compare distance from zero before comparing signs', 'Make students justify equivalence by position, not appearance'],
  },
  'percentage-bars': {
    animation: 'percentage-bars',
    researchBasis: [
      'Percent means per hundred, so hundred grids and proportional bars make the whole explicit.',
      'Double number lines and multiplier machines clarify percentage increase, decrease and reverse percentages.',
    ],
    diagrams: ['Hundred square', 'Percent bar model', 'Double number line', 'Multiplier machine', 'Original-change-final price tag'],
    interactions: ['Shade cells to a target percent', 'Slide a multiplier handle', 'Choose original or final value', 'Compare fraction, decimal and percent cards'],
    threeDModels: ['Hundred-tile wall', 'Animated price tag slab', 'Percent liquid tank', 'Multiplier portal'],
    cinematicScenes: ['Whole appears as 100 cells', 'Shade grows into a percent', 'Multiplier transforms value', 'Discount folds original into final'],
    teacherMoves: ['Identify the whole first', 'Separate change from final value', 'Use multiplier language for efficiency'],
  },
  'ratio-mixer': {
    animation: 'ratio-mixer',
    researchBasis: [
      'Tape diagrams reveal total parts and individual shares.',
      'Mixture models and ratio tables support scaling and equivalent ratios.',
    ],
    diagrams: ['Tape diagram', 'Ratio table', 'Mixture containers', 'Scale drawing ruler', 'Unit-rate comparison table'],
    interactions: ['Drag blocks into ratio groups', 'Fill two linked tanks', 'Scale a recipe slider', 'Compare unit prices'],
    threeDModels: ['Linked liquid tanks', 'Part blocks on a rail', 'Scale model room', 'Unit-rate balance'],
    cinematicScenes: ['Parts assemble into a whole', 'One part is discovered', 'Shares grow from one part', 'Equivalent ratio table expands'],
    teacherMoves: ['Count total parts first', 'Name one part before shares', 'Check units before using scale'],
  },
  'algebra-tiles': {
    animation: 'algebra-tiles',
    researchBasis: [
      'Algebra tiles distinguish variables, constants and like terms physically.',
      'Growing patterns support generalisation to nth-term rules.',
      'Area models make expansion and factorisation reversible.',
    ],
    diagrams: ['Growing tile pattern', 'Like-term sorting mat', 'Area model for brackets', 'Factorisation tray', 'Input-output machine'],
    interactions: ['Sort like terms', 'Build a pattern term', 'Drag tiles into an area model', 'Pull out a common factor'],
    threeDModels: ['Variable tile blocks', 'Constant cubes', 'Bracket area wall', 'Pattern staircase'],
    cinematicScenes: ['Pattern grows term by term', 'Tiles sort by identity', 'Bracket opens into an area', 'Factor tray reverses expansion'],
    teacherMoves: ['Ask what changes and what stays constant', 'Insist unlike terms stay separate', 'Check factorisation by expanding'],
  },
  'equation-balance': {
    animation: 'equation-balance',
    researchBasis: [
      'Balance scales model equality and inverse operations.',
      'Flow diagrams make solving and formula rearrangement a reversible process.',
      'Boundary testing supports inequalities.',
    ],
    diagrams: ['Equation balance', 'Inverse-operation flowchart', 'Substitution panel', 'Inequality boundary line', 'Check-by-substitution table'],
    interactions: ['Remove equal weights from both sides', 'Reverse an operation chain', 'Test values in an inequality', 'Substitute values into a formula'],
    threeDModels: ['3D balance scale', 'Operation conveyor belt', 'Inequality gate', 'Formula control room'],
    cinematicScenes: ['Equation appears balanced', 'Same action hits both sides', 'Unknown is isolated', 'Solution is checked'],
    teacherMoves: ['Say both sides after every operation', 'Use inverse order', 'Check the answer in the original equation'],
  },
  'coordinate-grid': {
    animation: 'coordinate-grid',
    researchBasis: [
      'Tables, graphs and rules are linked representations of the same relationship.',
      'Gradient triangles connect visual slope to rate of change.',
      'Intersections represent equal outputs.',
    ],
    diagrams: ['Coordinate plane', 'Table-to-graph mapping', 'Gradient triangle', 'Distance-time trace', 'Intersection comparison'],
    interactions: ['Plot ordered pairs', 'Fill a table row', 'Drag a gradient triangle', 'Move along a rate graph'],
    threeDModels: ['Glowing graph floor', 'Moving point drone', 'Gradient ramp', 'Intersection beacon'],
    cinematicScenes: ['Grid powers on', 'Table rows become points', 'Line draws through points', 'Gradient triangle rises', 'Intersection pulses'],
    teacherMoves: ['Read x before y', 'Ask what slope means in context', 'Use the same scale on both axes'],
  },
  'angle-lab': {
    animation: 'angle-lab',
    researchBasis: [
      'Rotating rays build angle size dynamically.',
      'Parallel-line overlays reveal equal and supplementary angle relationships.',
      'Polygon triangulation explains angle sums.',
    ],
    diagrams: ['Rotating angle arms', 'Parallel-line angle overlay', 'Polygon triangulation', 'Bearing compass', 'Proof reason trail'],
    interactions: ['Rotate a ray to a target angle', 'Select matching angle pairs', 'Split a polygon into triangles', 'Measure clockwise bearing'],
    threeDModels: ['Rotating ray compass', 'Parallel light rails', 'Polygon glass panels', 'Bearing compass disc'],
    cinematicScenes: ['Angle arm rotates', 'Equal angles glow', 'Polygon splits into triangles', 'Bearing needle sweeps clockwise'],
    teacherMoves: ['Name the angle fact before calculating', 'Attach a reason to every step', 'Use three-digit bearings'],
  },
  'circle-lab': {
    animation: 'circle-lab',
    researchBasis: [
      'Circle-part vocabulary becomes clearer when parts are revealed one at a time.',
      'Circumference unwrapping explains pi as boundary-to-diameter ratio.',
      'Sector rearrangement explains area as a near-rectangle.',
    ],
    diagrams: ['Radius and diameter reveal', 'Circumference unwrap', 'Sector-to-rectangle rearrangement', 'Semicircle and quadrant pieces', 'Arc plus straight-edge perimeter'],
    interactions: ['Label circle parts', 'Unwrap circumference', 'Rearrange sectors', 'Choose perimeter or area formula'],
    threeDModels: ['Glowing circle disc', 'Unrolling boundary ribbon', 'Sector fan pieces', 'Circular object overlay'],
    cinematicScenes: ['Circle parts orbit in', 'Boundary unwraps', 'Sectors rearrange', 'Formula locks into place'],
    teacherMoves: ['Decide if measuring length or area', 'Use radius vs diameter carefully', 'Include straight edges in semicircle perimeter'],
  },
  'construction-compass': {
    animation: 'construction-compass',
    researchBasis: [
      'Compass arcs represent equal distances without measuring.',
      'Construction marks reveal why a result is exact.',
      'Congruence can be shown through rigid motion.',
    ],
    diagrams: ['Compass arcs', 'Triangle construction steps', 'Perpendicular bisector equal-distance model', 'Angle bisector arcs', 'Congruence overlay'],
    interactions: ['Set compass radius', 'Sweep arcs from endpoints', 'Join intersection points', 'Overlay congruent shapes'],
    threeDModels: ['Compass arm on construction board', 'Arc light trails', 'Rigid-motion shape panels', 'Bisector laser line'],
    cinematicScenes: ['Base segment draws', 'Compass arcs sweep', 'Intersection locks', 'Construction marks verify result'],
    teacherMoves: ['Keep compass width fixed', 'Preserve construction marks', 'Use triangle inequality before constructing'],
  },
  'solid-builder': {
    animation: 'solid-builder',
    researchBasis: [
      'Nets connect 3D solids to surface area.',
      'Unit cubes make volume countable as layers.',
      'Decomposition supports compound area and volume.',
    ],
    diagrams: ['Prism net', 'Unit cube layers', 'Compound shape split', 'Surface area face map', 'Capacity conversion model'],
    interactions: ['Unfold a prism', 'Fill layers with cubes', 'Split a compound shape', 'Match face pairs'],
    threeDModels: ['Foldable cuboid net', 'Unit cube voxel stack', '3D classroom pod', 'Liquid capacity tank'],
    cinematicScenes: ['Solid rotates', 'Faces unfold', 'Areas add up', 'Cubes fill volume layer by layer'],
    teacherMoves: ['Count every face once', 'Use perpendicular height', 'Track squared vs cubed units'],
  },
  'data-lab': {
    animation: 'data-lab',
    researchBasis: [
      'Dot plots and frequency tables make distributions visible.',
      'Mean as a balance point supports conceptual understanding.',
      'Comparing centre and spread prevents overreliance on one average.',
    ],
    diagrams: ['Data pipeline', 'Frequency table', 'Dot plot', 'Mean balance beam', 'Two-distribution comparison'],
    interactions: ['Sort survey responses', 'Stack dots', 'Move mean balance point', 'Compare two distributions'],
    threeDModels: ['Data columns', 'Mean balance platform', 'Survey pipeline tubes', 'Distribution landscape'],
    cinematicScenes: ['Question becomes data', 'Dots stack into plot', 'Mean balances the set', 'Two groups compare'],
    teacherMoves: ['Ask if the question is biased', 'Compare centre and spread', 'Check sample size before concluding'],
  },
  'probability-spinner': {
    animation: 'probability-spinner',
    researchBasis: [
      'Sample space diagrams clarify favourable over total outcomes.',
      'Spinners show probability as proportional area.',
      'Experimental probability stabilises with repeated trials.',
    ],
    diagrams: ['Probability scale', 'Spinner sectors', 'Sample space table', 'Complement region', 'Experimental frequency bar'],
    interactions: ['Spin trials', 'Shade favourable sectors', 'Flip to complement', 'Compare theory and experiment'],
    threeDModels: ['3D spinner wheel', 'Outcome token arena', 'Probability scale rail', 'Trial counter tower'],
    cinematicScenes: ['Probability scale lights up', 'Spinner sectors glow', 'Complement flips', 'Trials accumulate into bars'],
    teacherMoves: ['Count total outcomes', 'Check equally likely assumption', 'Use complement when easier'],
  },
};

export function getVisualResearchBlueprint(animation: AnimationMode) {
  return mathVisualResearchRegistry[animation];
}
