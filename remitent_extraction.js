function extractRecipientsToCSV() {
  // 1. Search for Temu emails
  const threads = GmailApp.search('from:temu.com OR subject:"Temu"');
  let csvData = "Date,Subject,To,Cc,Bcc\n"; // CSV header
  
  // 2. Extract recipient info from each email
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(message => {
      const date = message.getDate().toISOString();
      const subject = message.getSubject();
      const to = message.getTo();
      const cc = message.getCc() || ""; // Handle empty Cc
      const bcc = message.getBcc() || ""; // Handle empty Bcc
      
      // Escape commas in subject/recipients
      const escapeCsv = (str) => `"${str.replace(/"/g, '""')}"`;
      
      csvData += [
        escapeCsv(date),
        escapeCsv(subject),
        escapeCsv(to),
        escapeCsv(cc),
        escapeCsv(bcc)
      ].join(",") + "\n";
    });
  });
  
  // 3. Save CSV to Google Drive
  const fileName = `Temu_Recipients_${new Date().toISOString().slice(0,10)}.csv`;
  const folder = DriveApp.getRootFolder(); // Or use a specific folder ID
  folder.createFile(fileName, csvData, MimeType.CSV);
  
  console.log(`Generated CSV: ${fileName}`);
  return csvData; // Optional: Return data for debugging
}