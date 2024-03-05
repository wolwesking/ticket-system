function formatSubject(text) {
  const regex = /\[Ticket#:\s*(\d+)\]/;
  const match = regex.exec(text);

  if (match && match[1]) {
    const ids = match[1];
    return ids;
  } else {
    console.log("No match found");
    return null;
  }
}

module.exports = formatSubject;