function extractEmailContent(text) {
  const regex = /Email Content:([\s\S]*?)\nOn Mon,/;
  const match = regex.exec(text);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return null; // Return null if the pattern is not found
  }
}

module.exports = extractEmailContent;
