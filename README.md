That is a integration with google to automate some tasks
📧 GMAIL MESSAGE METHODS AVAILABLE:
=================================

🆔 IDENTIFIERS:
- message.getId()                    // Unique message ID (use for deletion)
- thread.getId()                     // Thread ID (groups related messages)

📋 BASIC INFO:
- message.getDate()                  // Date sent/received
- message.getFrom()                  // Sender email
- message.getTo()                    // Recipients
- message.getCc()                    // CC recipients
- message.getBcc()                   // BCC recipients
- message.getSubject()               // Subject line
- message.getReplyTo()               // Reply-to address

📄 CONTENT:
- message.getBody()                  // HTML body
- message.getPlainBody()             // Plain text body
- message.getRawContent()            // Raw email content
- message.getHeader(name)            // Specific header value

📎 ATTACHMENTS:
- message.getAttachments()           // Array of attachments
- attachment.getName()               // Attachment filename
- attachment.getSize()               // Attachment size
- attachment.getContentType()        // MIME type
- attachment.getBytes()              // File data

🏷️ STATUS & LABELS:
- message.isUnread()                 // Unread status
- message.isStarred()                // Starred status
- message.isImportant()              // Important status
- message.isDraft()                  // Draft status
- message.isInChats()                // In chats folder
- message.isInInbox()                // In inbox
- message.isInPriorityInbox()        // In priority inbox
- message.isInSent()                 // In sent folder
- message.isInSpam()                 // In spam folder
- message.isInTrash()                // In trash
- thread.getLabels()                 // Gmail labels

⚡ ACTIONS (use Message ID):
- message.markRead()                 // Mark as read
- message.markUnread()               // Mark as unread
- message.star()                     // Add star
- message.unstar()                   // Remove star
- message.markImportant()            // Mark important
- message.markUnimportant()          // Mark unimportant
- message.moveToTrash()              // Delete (move to trash)
- message.forward(recipient)         // Forward email
- message.reply(body)                // Reply to email
- message.replyAll(body)             // Reply all

🔍 SEARCH OPTIONS:
- GmailApp.search('query')           // Search with Gmail syntax
- Examples:
  * 'from:sender@email.com'
  * 'subject:"specific subject"'
  * 'has:attachment'
  * 'is:unread'
  * 'newer_than:7d'
  * 'older_than:1y'
  * 'label:important'