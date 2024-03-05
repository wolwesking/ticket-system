function extractEmailContent(text) {
  const regex = /([\s\S]*?)(?:\n|$)/i;
  const match = regex.exec(text);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return null; // Return null if the pattern is not found
  }
}

module.exports = extractEmailContent;