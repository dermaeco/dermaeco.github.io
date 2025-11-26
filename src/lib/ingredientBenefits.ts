// Scientific ingredient benefits database
export const ingredientBenefits: { [key: string]: string } = {
  // Natural oils
  'rosehip oil': 'Rich in essential fatty acids (omega-3, omega-6) and vitamin A, stimulates collagen production, reduces hyperpigmentation through natural retinoids, and improves skin elasticity',
  'argan oil': 'High in vitamin E and fatty acids, strengthens skin barrier, provides antioxidant protection, and improves skin hydration without clogging pores',
  'jojoba oil': 'Mimics skin sebum, regulates oil production, has anti-inflammatory properties, and helps balance both dry and oily skin types',
  'sweet almond oil': 'Contains vitamin E and fatty acids, deeply moisturizes, reduces inflammation, and improves skin tone',
  'coconut oil': 'Contains lauric acid with antimicrobial properties, deeply hydrates, strengthens skin barrier, and has anti-inflammatory effects',
  'squalane': 'Biomimetic lipid that enhances skin barrier function, provides deep hydration, has antioxidant properties, and improves skin elasticity',
  
  // Active ingredients
  'retinol': 'Vitamin A derivative that accelerates cell turnover, stimulates collagen synthesis, reduces fine lines and wrinkles, and improves skin texture',
  'niacinamide': 'Vitamin B3 that reduces inflammation, minimizes pore appearance, regulates sebum production, improves skin barrier function, and reduces hyperpigmentation',
  'vitamin c': 'Powerful antioxidant that neutralizes free radicals, brightens skin, stimulates collagen production, and reduces hyperpigmentation',
  'hyaluronic acid': 'Humectant that holds up to 1000x its weight in water, deeply hydrates skin, plumps fine lines, and improves skin texture',
  'salicylic acid': 'Beta hydroxy acid (BHA) that penetrates pores, exfoliates dead skin cells, reduces acne, and has anti-inflammatory properties',
  'glycolic acid': 'Alpha hydroxy acid (AHA) that exfoliates surface skin, improves texture, reduces hyperpigmentation, and stimulates collagen production',
  'peptides': 'Amino acid chains that signal skin to produce more collagen and elastin, improve firmness, and reduce wrinkle depth',
  
  // Botanical extracts
  'green tea': 'Contains polyphenols (EGCG) with potent antioxidant and anti-inflammatory properties, protects against UV damage, and reduces sebum production',
  'chamomile': 'Contains bisabolol and chamazulene with anti-inflammatory and soothing properties, reduces redness, and calms sensitive skin',
  'calendula': 'Anti-inflammatory and antimicrobial properties, accelerates wound healing, soothes irritation, and promotes skin regeneration',
  'aloe vera': 'Contains vitamins, minerals, and polysaccharides that hydrate, soothe inflammation, accelerate healing, and provide antimicrobial benefits',
  'tea tree': 'Contains terpinen-4-ol with strong antimicrobial and anti-inflammatory properties, effective against acne-causing bacteria',
  'lavender': 'Anti-inflammatory and antimicrobial properties, promotes healing, reduces redness, and has calming effects',
  'rose': 'Rich in antioxidants and vitamins, anti-inflammatory, balances skin pH, and provides hydration',
  
  // Ceramides and lipids
  'ceramides': 'Essential lipids that strengthen skin barrier, prevent moisture loss, protect against environmental damage, and reduce inflammation',
  'cholesterol': 'Natural lipid that repairs skin barrier, improves hydration, and works synergistically with ceramides and fatty acids',
  
  // Other actives
  'zinc': 'Anti-inflammatory mineral that regulates sebum production, has antimicrobial properties, and accelerates wound healing',
  'nori extract': 'Marine extract rich in vitamins and minerals, provides antioxidant protection, and improves skin hydration',
  'bakuchiol': 'Natural retinol alternative derived from plants, stimulates collagen production, improves elasticity, and reduces fine lines without irritation',
  'azelaic acid': 'Multi-functional acid that reduces acne, brightens skin, has antimicrobial properties, and reduces inflammation',
  'ferulic acid': 'Antioxidant that enhances vitamin C and E stability, neutralizes free radicals, and protects against UV damage',
}

export function getIngredientBenefit(ingredient: string): string {
  const normalizedIngredient = ingredient.toLowerCase().trim()
  
  // Try exact match first
  if (ingredientBenefits[normalizedIngredient]) {
    return ingredientBenefits[normalizedIngredient]
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(ingredientBenefits)) {
    if (normalizedIngredient.includes(key) || key.includes(normalizedIngredient)) {
      return value
    }
  }
  
  return ''
}

export function generateScientificRecommendation(
  product: any, 
  skinType: string, 
  concerns: string[]
): string {
  const reasons: string[] = []
  
  // Get ingredient benefits
  const keyIngredient = product.key_ingredients?.[0]
  if (keyIngredient) {
    const benefit = getIngredientBenefit(keyIngredient)
    if (benefit) {
      reasons.push(`${keyIngredient} ${benefit}`)
    }
  }
  
  // Add skin type match
  const productSkinTypes = product.skin_types?.map((t: string) => t.toLowerCase()) || []
  if (productSkinTypes.some((t: string) => t.includes('all') || t.includes(skinType))) {
    reasons.push(`Formulated specifically for ${skinType} skin`)
  }
  
  // Add concern match
  const matchedConcerns = product.concerns_addressed?.filter((concern: string) =>
    concerns.some(userConcern => 
      concern.toLowerCase().includes(userConcern.toLowerCase()) ||
      userConcern.toLowerCase().includes(concern.toLowerCase())
    )
  ) || []
  
  if (matchedConcerns.length > 0) {
    reasons.push(`Clinically proven to address ${matchedConcerns.slice(0, 2).join(' and ').toLowerCase()}`)
  }
  
  return reasons.length > 0 
    ? reasons.join('. ') + '.'
    : 'Recommended based on your skin profile and analysis results.'
}
