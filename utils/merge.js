function mergeSuggestions(suggestions) {
  const filtered = suggestions.filter(
    (s) => !s.startsWith("Error from") && !s.startsWith("No response from")
  );

  if (filtered.length === 0) {
    return "❌ All suggestion models failed. Please try again later.";
  }

  // Simple merge: join them with spacing
  return `💡 Final Idea: ${filtered.join(" | ")}`;
}

module.exports = { mergeSuggestions };
