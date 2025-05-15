function mergeSuggestions(suggestions) {
  const filtered = suggestions.filter(
    (s) => !s.startsWith("Error from") && !s.startsWith("No response from")
  );

  if (filtered.length === 0) {
    return "ERROR: All suggestion models failed. Please try again later.";
  }

  // Create a well-documented format
  const formattedResponse = `
=== AI BRAINSTORMING RESULTS ===

${filtered
  .map(
    (suggestion, index) => `
SUGGESTION #${index + 1}:
----------------
${suggestion}
`
  )
  .join("\n")}

=== SYNTHESIZED INSIGHT ===
${filtered.join("\n\nKey Point: ")}
`;

  return formattedResponse;
}

module.exports = { mergeSuggestions };
