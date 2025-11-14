export class EmailTemplates {
  private static readonly BRAND_COLOR = '#ea580c';
  private static readonly SECONDARY_COLOR = '#f97316';

  private static getBaseTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GymFlow</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, ${this.BRAND_COLOR} 0%, ${this.SECONDARY_COLOR} 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      color: #374151;
    }
    .content h1 {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 20px 0;
    }
    .content p {
      margin: 0 0 16px 0;
      color: #4b5563;
    }
    .booking-card {
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      border-left: 4px solid ${this.BRAND_COLOR};
    }
    .booking-card h2 {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 16px 0;
    }
    .detail-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
      min-width: 120px;
    }
    .detail-value {
      color: #111827;
      font-weight: 500;
    }
    .button {
      display: inline-block;
      background-color: ${this.BRAND_COLOR};
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background-color: ${this.SECONDARY_COLOR};
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-confirmed {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 24px 0;
    }
    .highlight {
      background-color: #fef3c7;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 3px solid #f59e0b;
    }
    .price-total {
      font-size: 28px;
      font-weight: bold;
      color: ${this.BRAND_COLOR};
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">GymFlow</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>GymFlow</strong></p>
      <p>Your fitness journey starts here</p>
      <p style="margin-top: 16px;">
        <a href="mailto:support@gymflow.com" style="color: ${this.BRAND_COLOR}; text-decoration: none;">support@gymflow.com</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © 2024 GymFlow. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  public static bookingConfirmation(
    userName: string,
    className: string,
    instructor: string,
    date: string,
    time: string,
    duration: string,
    location: string,
    price: string,
    bookingId: string
  ): string {
    const content = `
      <h1>Booking Confirmed! 🎉</h1>
      <p>Hi <strong>%s</strong>,</p>
      <p>Great news! Your class booking has been confirmed. We're excited to see you there!</p>

      <div class="booking-card">
        <h2>%s</h2>
        <div class="detail-row">
          <span class="detail-label">Instructor:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="divider"></div>
        <div class="detail-row">
          <span class="detail-label">Total Price:</span>
          <span class="price-total">$%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking ID:</span>
          <span class="detail-value" style="font-family: monospace; font-size: 12px;">%s</span>
        </div>
      </div>

      <div class="highlight">
        <p style="margin: 0;"><strong>📍 What to bring:</strong></p>
        <p style="margin: 8px 0 0 0;">Please arrive 10 minutes early. Bring a water bottle and a towel. We provide mats and equipment.</p>
      </div>

      <div style="text-align: center;">
        <a href="https://gymflow.com/dashboard" class="button">View My Bookings</a>
      </div>

      <p style="margin-top: 32px; color: #6b7280;">If you need to cancel or reschedule, you can do so from your dashboard up to 24 hours before the class.</p>
    `;

    return this.getBaseTemplate(content).formatted(
      userName,
      className,
      instructor,
      date,
      time,
      duration,
      location,
      price,
      bookingId
    );
  }

  public static bookingCancellation(
    userName: string,
    className: string,
    instructor: string,
    date: string,
    time: string,
    refundAmount: string,
    bookingId: string
  ): string {
    const content = `
      <h1>Booking Cancelled</h1>
      <p>Hi <strong>%s</strong>,</p>
      <p>Your booking has been successfully cancelled as requested.</p>

      <div class="booking-card">
        <h2>%s</h2>
        <div style="margin-bottom: 16px;">
          <span class="status-badge status-cancelled">Cancelled</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Instructor:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="divider"></div>
        <div class="detail-row">
          <span class="detail-label">Refund Amount:</span>
          <span class="detail-value" style="color: #059669; font-weight: bold;">$%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking ID:</span>
          <span class="detail-value" style="font-family: monospace; font-size: 12px;">%s</span>
        </div>
      </div>

      <div class="highlight">
        <p style="margin: 0;"><strong>💳 Refund Information:</strong></p>
        <p style="margin: 8px 0 0 0;">Your refund will be processed within 5-7 business days to your original payment method.</p>
      </div>

      <div style="text-align: center;">
        <a href="https://gymflow.com/classes" class="button">Browse Other Classes</a>
      </div>

      <p style="margin-top: 32px; color: #6b7280;">We hope to see you again soon! If you have any questions, please don't hesitate to contact us.</p>
    `;

    return this.getBaseTemplate(content).formatted(
      userName,
      className,
      instructor,
      date,
      time,
      refundAmount,
      bookingId
    );
  }

  public static bookingReminder(
    userName: string,
    className: string,
    instructor: string,
    date: string,
    time: string,
    location: string,
    hoursUntilClass: string
  ): string {
    const content = `
      <h1>Class Reminder ⏰</h1>
      <p>Hi <strong>%s</strong>,</p>
      <p>This is a friendly reminder that your class is coming up in <strong>%s hours</strong>!</p>

      <div class="booking-card">
        <h2>%s</h2>
        <div style="margin-bottom: 16px;">
          <span class="status-badge status-confirmed">Confirmed</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Instructor:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">%s</span>
        </div>
      </div>

      <div class="highlight">
        <p style="margin: 0;"><strong>✅ Quick Checklist:</strong></p>
        <p style="margin: 8px 0 0 0;">
          • Arrive 10 minutes early<br>
          • Bring water and towel<br>
          • Wear comfortable workout attire<br>
          • Don't forget your enthusiasm!
        </p>
      </div>

      <div style="text-align: center;">
        <a href="https://gymflow.com/dashboard" class="button">View Details</a>
      </div>

      <p style="margin-top: 32px; color: #6b7280;">Can't make it? Remember to cancel at least 24 hours in advance for a full refund.</p>
    `;

    return this.getBaseTemplate(content).formatted(
      userName,
      hoursUntilClass,
      className,
      instructor,
      date,
      time,
      location
    );
  }

  public static welcomeEmail(
    userName: string,
    email: string
  ): string {
    const content = `
      <h1>Welcome to GymFlow! 🎉</h1>
      <p>Hi <strong>%s</strong>,</p>
      <p>We're thrilled to have you join our fitness community! Your account has been successfully created.</p>

      <div class="booking-card">
        <h2>Your Account Details</h2>
        <div class="detail-row">
          <span class="detail-label">Username:</span>
          <span class="detail-value">%s</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">%s</span>
        </div>
      </div>

      <div class="highlight">
        <p style="margin: 0;"><strong>🚀 Get Started:</strong></p>
        <p style="margin: 8px 0 0 0;">
          1. Browse our wide selection of fitness classes<br>
          2. Book your first class and receive 10%% off<br>
          3. Track your progress in your personal dashboard<br>
          4. Join our community and achieve your fitness goals!
        </p>
      </div>

      <div style="text-align: center;">
        <a href="https://gymflow.com/classes" class="button">Browse Classes</a>
      </div>

      <p style="margin-top: 32px; color: #6b7280;">Need help getting started? Our support team is here for you 24/7.</p>
    `;

    return this.getBaseTemplate(content).formatted(
      userName,
      userName,
      email
    );
  }

  public static passwordReset(
    userName: string,
    resetLink: string
  ): string {
    const content = `
      <h1>Reset Your Password</h1>
      <p>Hi <strong>%s</strong>,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="%s" class="button">Reset Password</a>
      </div>

      <div class="highlight">
        <p style="margin: 0;"><strong>🔒 Security Notice:</strong></p>
        <p style="margin: 8px 0 0 0;">
          This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>

      <p style="margin-top: 32px; color: #6b7280; font-size: 13px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="font-family: monospace; word-break: break-all; color: #4b5563;">%s</span>
      </p>
    `;

    return this.getBaseTemplate(content).formatted(
      userName,
      resetLink,
      resetLink
    );
  }
}
