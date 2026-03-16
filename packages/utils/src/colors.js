// --- Oklab Conversion Constants ---

// Matrix 1: Oklab to LMS' (intermediate cone responses)
// These constants represent the multipliers for converting Oklab (L, a, b)
// to the intermediate LMS' cone response values (L', M', S').
// Format: OKLAB_TO_LMS_PRIME_<OutputCone>_<InputComponent>
const OKLAB_TO_LMS_PRIME_L_FROM_L = 1.0;
const OKLAB_TO_LMS_PRIME_L_FROM_A = 0.3963377774;
const OKLAB_TO_LMS_PRIME_L_FROM_B = 0.2158037573;
const OKLAB_TO_LMS_PRIME_M_FROM_L = 1.0;
const OKLAB_TO_LMS_PRIME_M_FROM_A = -0.1055613458;
const OKLAB_TO_LMS_PRIME_M_FROM_B = -0.0638541728;
const OKLAB_TO_LMS_PRIME_S_FROM_L = 1.0;
const OKLAB_TO_LMS_PRIME_S_FROM_A = -0.0894841775;
const OKLAB_TO_LMS_PRIME_S_FROM_B = -1.2914855480;

// Matrix 2: LMS to Linear sRGB
// These constants represent the multipliers for converting the non-linear
// LMS cone response values (L, M, S) to Linear sRGB (R, G, B).
// Format: LMS_TO_LINEAR_RGB_<OutputChannel>_<InputCone>
const LMS_TO_LINEAR_RGB_R_FROM_L = +4.0767468451;
const LMS_TO_LINEAR_RGB_R_FROM_M = -3.3077115913;
const LMS_TO_LINEAR_RGB_R_FROM_S = +0.2309647462;
const LMS_TO_LINEAR_RGB_G_FROM_L = -1.2684380046;
const LMS_TO_LINEAR_RGB_G_FROM_M = +2.6097574011;
const LMS_TO_LINEAR_RGB_G_FROM_S = -0.3413193965;
const LMS_TO_LINEAR_RGB_B_FROM_L = -0.0041960863;
const LMS_TO_LINEAR_RGB_B_FROM_M = -0.7034186147;
const LMS_TO_LINEAR_RGB_B_FROM_S = +1.7076147010;

// --- sRGB Gamma Correction Constants ---
const GAMMA_THRESHOLD = 0.0031308;
const GAMMA_LOW_MULTIPLIER = 12.92;
const GAMMA_HIGH_MULTIPLIER = 1.055;
const GAMMA_EXPONENT = 1.0 / 2.4;
const GAMMA_OFFSET = 0.055;

const oklchRegExp = /oklch\(\s*(-?[\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*\)/i;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const applyGamma = (channel) => {
  const clamped = clamp01(channel);
  if (clamped <= GAMMA_THRESHOLD) {
    return GAMMA_LOW_MULTIPLIER * clamped;
  }
  else {
    return GAMMA_HIGH_MULTIPLIER * Math.pow(clamped, GAMMA_EXPONENT) - GAMMA_OFFSET;
  }
};

export function oklchToRgb(oklchString = '') {
  const match = oklchString.match(oklchRegExp);

  if (!match) {
    return null;
  }

  // Extract and convert L, C, H to numbers
  // The `if (!match)` check above ensures these captured groups exist if we reach this point.
  const [, lightnessStr, chromaStr, hueStr] = match;
  const lightness = parseFloat(lightnessStr);
  const chroma = parseFloat(chromaStr);
  const hue = parseFloat(hueStr);

  // Handle edge cases for pure white and black for efficiency and precision
  if (lightness >= 1.0) {
    return { r: 255, g: 255, b: 255 };
  }
  if (lightness <= 0.0) {
    return { r: 0, g: 0, b: 0 };
  }

  // Convert Hue to radians
  const hueRadians = hue * (Math.PI / 180);

  // Convert OKLCH to Oklab coordinates (a, b)
  const oklab_a = chroma * Math.cos(hueRadians);
  const oklab_b = chroma * Math.sin(hueRadians);

  // Convert Oklab to intermediate LMS cone responses (primed) using Matrix 1 constants
  const lms_l_prime = OKLAB_TO_LMS_PRIME_L_FROM_L * lightness + OKLAB_TO_LMS_PRIME_L_FROM_A * oklab_a
    + OKLAB_TO_LMS_PRIME_L_FROM_B * oklab_b;
  const lms_m_prime = OKLAB_TO_LMS_PRIME_M_FROM_L * lightness + OKLAB_TO_LMS_PRIME_M_FROM_A * oklab_a
    + OKLAB_TO_LMS_PRIME_M_FROM_B * oklab_b;
  const lms_s_prime = OKLAB_TO_LMS_PRIME_S_FROM_L * lightness + OKLAB_TO_LMS_PRIME_S_FROM_A * oklab_a
    + OKLAB_TO_LMS_PRIME_S_FROM_B * oklab_b;

  // Apply cube root non-linearity
  const lms_l = lms_l_prime * lms_l_prime * lms_l_prime;
  const lms_m = lms_m_prime * lms_m_prime * lms_m_prime;
  const lms_s = lms_s_prime * lms_s_prime * lms_s_prime;

  // Convert LMS to Linear sRGB using Matrix 2 constants
  const linearRed = LMS_TO_LINEAR_RGB_R_FROM_L * lms_l + LMS_TO_LINEAR_RGB_R_FROM_M * lms_m
    + LMS_TO_LINEAR_RGB_R_FROM_S * lms_s;
  const linearGreen = LMS_TO_LINEAR_RGB_G_FROM_L * lms_l + LMS_TO_LINEAR_RGB_G_FROM_M * lms_m
    + LMS_TO_LINEAR_RGB_G_FROM_S * lms_s;
  const linearBlue = LMS_TO_LINEAR_RGB_B_FROM_L * lms_l + LMS_TO_LINEAR_RGB_B_FROM_M * lms_m
    + LMS_TO_LINEAR_RGB_B_FROM_S * lms_s;

  const finalRed = applyGamma(linearRed);
  const finalGreen = applyGamma(linearGreen);
  const finalBlue = applyGamma(linearBlue);

  // Scale to 0-255 and round
  return {
    r: Math.round(finalRed * 255),
    g: Math.round(finalGreen * 255),
    b: Math.round(finalBlue * 255),
  };
}

function rgbComponentToHex(component) {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function oklchToHex(colorString = '') {
  if (!colorString) {
    return '';
  }

  if (hexRegex.test(colorString)) {
    return colorString; // Return directly if it's already a valid hex code
  }

  // If not a hex code, attempt OKLCH conversion
  const rgb = oklchToRgb(colorString);
  if (!rgb || typeof rgb !== 'object') { // Check if oklchToRgb returned a valid object
    return ''; // Return empty string if OKLCH conversion failed
  }
  const hexR = rgbComponentToHex(rgb.r);
  const hexG = rgbComponentToHex(rgb.g);
  const hexB = rgbComponentToHex(rgb.b);
  return `#${hexR}${hexG}${hexB}`;
}
