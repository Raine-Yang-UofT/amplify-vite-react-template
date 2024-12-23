import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
    const response = { ...event };
  
    try {
      if (event.triggerSource === "CustomMessage_SignUp") {
          // Customize verification email
          response.response.emailSubject = "Welcome to Repair:Genomics";
          response.response.emailMessage = `
            <h1>Welcome to Repair:Genomics</h1>
            <p>Hello ${event.request.userAttributes.name || 'there'},</p>
            <p>Thanks for signing up! Please verify your email by entering the following code:</p>
            <h2>${event.request.codeParameter}</h2>
            <p>If you didn't create this account, please ignore this email.</p>
          `;
      }
  
      if (response.response.emailMessage) {
        response.response.emailMessage += `
          <br><br>
          <p>Best regards,<br>Re:pair Genomics</p>
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please don't reply directly to this email.
          </p>
        `;
      }
  
    } catch (error) {
      console.error('Error in custom message lambda:', error);
      throw error;
    }
  
    return response;
  };