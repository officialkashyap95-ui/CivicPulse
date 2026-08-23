// Calculate civic issue priority score
// All input values should be between 0 and 10.

export const calculateImpactScore = ({
  severity = 0,
  publicImpact = 0,
  urgency = 0,
  infrastructureRisk = 0,
  reportCount = 1,
}) => {
  const safeSeverity = Math.min(Math.max(severity, 0), 10);
  const safePublicImpact = Math.min(Math.max(publicImpact, 0), 10);
  const safeUrgency = Math.min(Math.max(urgency, 0), 10);
  const safeInfrastructureRisk = Math.min(
    Math.max(infrastructureRisk, 0),
    10
  );

  /*
   * Report multiplier:
   *
   * 1 report   -> low
   * 10 reports -> moderate
   * 50 reports -> high
   * 100+       -> maximum
   */
  const reportImpact =
    Math.min(Math.log10(reportCount + 1) / 2, 1) * 10;

  /*
   * Public impact combines:
   * - AI/public impact
   * - number of citizens reporting
   */
  const combinedPublicImpact =
    Math.min(
      publicImpact * 0.6 + reportImpact * 0.4,
      10
    );

  /*
   * CivicPulse priority formula
   */
  const score =
    safeSeverity * 0.3 +
    combinedPublicImpact * 0.3 +
    safeUrgency * 0.2 +
    safeInfrastructureRisk * 0.2;

  return Number(score.toFixed(1));
};


// Convert numerical score into authority-friendly status
export const getPriorityLevel = (score) => {
  if (score >= 8.5) {
    return "CRITICAL";
  }

  if (score >= 7) {
    return "HIGH";
  }

  if (score >= 4) {
    return "MEDIUM";
  }

  return "LOW";
};