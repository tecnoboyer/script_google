function extractWorkingEmailFields() {
  const threads = GmailApp.search('newer_than:7d'); // Last 7 days
  
  // CSV header with content fields added
  let csvData = "ThreadId,MessageId,Date,From,To,Cc,Bcc,Subject,PlainBody,HtmlBody,IsUnread,IsStarred,IsDraft,AttachmentCount,Labels\n";
  
  console.log(`Found ${threads.length} threads. Processing first 50 emails...`);
  
  let count = 0;
  const maxEmails = 50;
  
  for (let i = 0; i < threads.length && count < maxEmails; i++) {
    const thread = threads[i];
    const messages = thread.getMessages();
    
    for (let j = 0; j < messages.length && count < maxEmails; j++) {
      const message = messages[j];
      
      try {
        // BASIC IDENTIFIERS (these always work)
        const threadId = thread.getId();
        const messageId = message.getId();
        
        // BASIC MESSAGE INFO (these always work)
        const date = message.getDate().toISOString();
        const from = message.getFrom() || "";
        const to = message.getTo() || "";
        const cc = message.getCc() || "";
        const bcc = message.getBcc() || "";
        const subject = message.getSubject() || "";
        
        // EMAIL CONTENT
        const plainBody = message.getPlainBody() || "";
        const htmlBody = message.getBody() || "";
        
        // Truncate content for CSV (full content can be very long)
        const plainBodyTruncated = plainBody.length > 500 ? plainBody.substring(0, 500) + "..." : plainBody;
        const htmlBodyTruncated = htmlBody.length > 500 ? htmlBody.substring(0, 500) + "..." : htmlBody;
        
        // STATUS FLAGS (only the confirmed working ones)
        const isUnread = message.isUnread();
        const isStarred = message.isStarred();
        const isDraft = message.isDraft();
        
        // ATTACHMENTS (count only)
        const attachmentCount = message.getAttachments().length;
        
        // LABELS (from thread level)
        const threadLabels = thread.getLabels();
        const labelNames = threadLabels.map(label => label.getName()).join(';');
        
        // Simple CSV escaping
        const escapeCsv = (str) => {
          const s = String(str || "");
          if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        };
        
        // Build CSV row
        csvData += [
          escapeCsv(threadId),
          escapeCsv(messageId),
          escapeCsv(date),
          escapeCsv(from),
          escapeCsv(to),
          escapeCsv(cc),
          escapeCsv(bcc),
          escapeCsv(subject),
          escapeCsv(plainBodyTruncated),
          escapeCsv(htmlBodyTruncated),
          escapeCsv(isUnread),
          escapeCsv(isStarred),
          escapeCsv(isDraft),
          escapeCsv(attachmentCount),
          escapeCsv(labelNames)
        ].join(",") + "\n";
        
        count++;
        console.log(`${count}/50: From: ${from} | Subject: ${subject.substring(0,40)}...`);
        
      } catch (error) {
        console.log(`Error processing email ${count + 1}: ${error.message}`);
        console.log(`Skipping this email and continuing...`);
      }
    }
  }
  
  // Save to Google Drive
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `Gmail_Working_Fields_${timestamp}.csv`;
  
  const blob = Utilities.newBlob(csvData, MimeType.CSV, fileName);
  const file = DriveApp.getRootFolder().createFile(blob);
  
  console.log(`\n✅ Extraction completed successfully!`);
  console.log(`📧 Processed ${count} emails`);
  console.log(`📁 File created: ${fileName}`);
  console.log(`🆔 File ID: ${file.getId()}`);
  console.log(`🔗 Download link: https://drive.google.com/file/d/${file.getId()}/view`);
  
  return {
    fileName: fileName,
    fileId: file.getId(),
    processedEmails: count,
    downloadUrl: `https://drive.google.com/file/d/${file.getId()}/view`
  };
}

// Version with FULL email content (not truncated)
function extractWithFullContent() {
  const threads = GmailApp.search('newer_than:3d'); // Last 3 days only
  
  let csvData = "ThreadId,MessageId,Date,From,To,Subject,PlainBody,HtmlBody\n";
  
  console.log(`Processing first 10 emails with FULL content...`);
  
  let count = 0;
  for (let i = 0; i < threads.length && count < 10; i++) {
    const messages = threads[i].getMessages();
    
    for (let j = 0; j < messages.length && count < 10; j++) {
      try {
        const message = messages[j];
        const thread = threads[i];
        
        const threadId = thread.getId();
        const messageId = message.getId();
        const date = message.getDate().toISOString();
        const from = message.getFrom();
        const to = message.getTo();
        const subject = message.getSubject();
        
        // FULL CONTENT (no truncation)
        const plainBody = message.getPlainBody() || "";
        const htmlBody = message.getBody() || "";
        
        const escape = (s) => {
          const str = String(s || "");
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        
        csvData += [
          escape(threadId),
          escape(messageId),
          escape(date),
          escape(from),
          escape(to),
          escape(subject),
          escape(plainBody),
          escape(htmlBody)
        ].join(",") + "\n";
        
        count++;
        console.log(`${count}: ${from} - ${subject} (${plainBody.length} chars)`);
        
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  }
  
  const fileName = `Gmail_Full_Content_${new Date().toISOString().slice(0, 10)}.csv`;
  const file = DriveApp.getRootFolder().createFile(fileName, csvData, MimeType.CSV);
  
  console.log(`File created: ${fileName}`);
  console.log(`Download: https://drive.google.com/file/d/${file.getId()}/view`);
  
  return fileName;
}

// Test content methods specifically
function testContentMethods() {
  const threads = GmailApp.search('newer_than:1d');
  if (threads.length === 0) {
    console.log("No recent emails found for testing");
    return;
  }
  
  const message = threads[0].getMessages()[0];
  
  console.log("=== TESTING EMAIL CONTENT METHODS ===");
  
  try {
    const plainBody = message.getPlainBody();
    console.log(`✅ getPlainBody(): ${plainBody.length} characters`);
    console.log(`   Preview: "${plainBody.substring(0, 100)}..."`);
  } catch (error) {
    console.log(`❌ getPlainBody(): ${error.message}`);
  }
  
  try {
    const htmlBody = message.getBody();
    console.log(`✅ getBody() [HTML]: ${htmlBody.length} characters`);
    console.log(`   Preview: "${htmlBody.substring(0, 100)}..."`);
  } catch (error) {
    console.log(`❌ getBody(): ${error.message}`);
  }
  
  try {
    const rawContent = message.getRawContent();
    console.log(`✅ getRawContent(): ${rawContent.length} characters`);
  } catch (error) {
    console.log(`❌ getRawContent(): ${error.message}`);
  }
  
  try {
    const replyTo = message.getReplyTo();
    console.log(`✅ getReplyTo(): ${replyTo}`);
  } catch (error) {
    console.log(`❌ getReplyTo(): ${error.message}`);
  }
}
extractWorkingEmailFields()