# Notification System Documentation

## Overview
Comprehensive email notification system with automated alerts and scheduled reports for the Dairy Management System.

## ✅ Implemented Features

### 1. **Password Reset System**
- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Frontend**: `/reset-password?token=xxx`
- **Description**: Users can request a password reset link via email
- **Token Validity**: 1 hour
- **Email Template**: Professional HTML with reset link button
- **Security**: Token hashed in database using SHA-256

**Usage:**
```typescript
// Request password reset
await api.auth.forgotPassword('user@example.com');

// Reset password with token
await api.auth.resetPassword(token, newPassword);
```

### 2. **Order Confirmation Emails**
- **Trigger**: Automatically sent when a new order is created
- **Recipient**: Client who placed the order
- **Content**: 
  - Order number and date
  - Delivery information
  - Itemized product list with quantities and prices
  - Total amount
  - Order status

**Email Includes:**
- Order details table
- Delivery date and address
- Total amount with proper formatting
- Professional branding

### 3. **Low Stock Alerts**
- **Schedule**: Daily at 9:00 AM
- **Recipients**: Admins and Managers
- **Trigger**: When product `currentStock` < `minThreshold`
- **Content**:
  - List of products running low
  - Current stock levels
  - Minimum required stock
  - Action required message

**Cron Job:**
```typescript
// Runs every day at 9 AM
cron.schedule('0 9 * * *', checkLowStock);
```

### 4. **Product Expiration Warnings**
- **Schedule**: Daily at 8:00 AM
- **Recipients**: Admins and Managers
- **Trigger**: Batches expiring within 7 days
- **Calculation**: `batch.startTime + product.shelfLife`
- **Content**:
  - Batch numbers
  - Product names
  - Quantities
  - Expiration dates
  - Days remaining (color-coded)

**Color Coding:**
- ⚠️ **Orange**: 4-7 days remaining
- 🔴 **Red**: 1-3 days remaining

### 5. **Payment Reminders**
- **Schedule**: Daily at 10:00 AM
- **Recipients**: Clients with overdue invoices
- **Trigger**: Invoices with `status = 'sent' OR 'overdue'` AND `dueDate < today`
- **Content**:
  - Invoice number and date
  - Due date
  - Amount due (large, prominent)
  - Days overdue
  - Payment methods
  - Contact information

**Auto-Update:**
- Automatically updates invoice status from 'sent' to 'overdue'

### 6. **Daily Production Reports**
- **Schedule**: Daily at 6:00 PM
- **Recipients**: Admins and Managers
- **Content**:
  - Total production quantity
  - Number of batches completed
  - Production breakdown by product
  - Number of active operators
  - Statistics cards with visual styling

**Report Includes:**
- Date of report
- Total production metrics
- Product-wise breakdown table
- Operator activity count

## 📧 Email Configuration

### Environment Variables (.env)
```properties
# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@dairysystem.com

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup Instructions
1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new app password for "Dairy Management System"
4. Use the 16-character password in `EMAIL_PASS`

### Testing Email Service
The server automatically tests email connectivity on startup:
```
✅ Email service is ready
```

If you see an error, check your email credentials.

## 🔄 Cron Jobs

### Schedule Overview
| Job | Time | Frequency | Purpose |
|-----|------|-----------|---------|
| Expiration Warning | 8:00 AM | Daily | Check batches expiring soon |
| Low Stock Alert | 9:00 AM | Daily | Check inventory levels |
| Payment Reminders | 10:00 AM | Daily | Send overdue invoice reminders |
| Production Report | 6:00 PM | Daily | Summary of day's production |

### Manual Control
```typescript
import cronJobs from './services/cronJobs';

// Start all jobs
cronJobs.startAllCronJobs();

// Start individual jobs
cronJobs.startLowStockAlert();
cronJobs.startExpirationWarning();
cronJobs.startPaymentReminders();
cronJobs.startDailyProductionReport();

// Stop all jobs
cronJobs.stopAllCronJobs();
```

### Server Integration
Cron jobs automatically start with the server:
```typescript
// backend/src/server.ts
server.listen(PORT, async () => {
  await emailService.testEmailConnection();
  cronJobs.startAllCronJobs();
});
```

Jobs gracefully stop on server shutdown:
```typescript
process.on('SIGTERM', () => {
  cronJobs.stopAllCronJobs();
  server.close();
});
```

## 📄 Email Templates

### Template Features
- ✅ Responsive HTML design
- ✅ Professional styling
- ✅ Dark mode friendly
- ✅ Mobile-optimized
- ✅ Branded with company name
- ✅ Clear call-to-action buttons
- ✅ Proper email formatting

### Template Structure
All emails include:
- Professional header with branding
- Clear subject and greeting
- Well-formatted content (tables for data)
- Action buttons where applicable
- Contact information
- Professional footer

## 🔒 Security Features

### Password Reset Security
- Tokens hashed using SHA-256
- 1-hour expiration window
- One-time use tokens
- Tokens cleared after use
- No password sent in email
- Secure reset link in email

### Email Sending Security
- TLS/SSL encryption
- App-specific passwords (no main password stored)
- Email validation
- Rate limiting on auth endpoints
- Secure token generation using crypto

## 🎯 Notification Recipients

### Admin/Manager Emails
System automatically fetches active admins and managers for alerts:
```typescript
const admins = await User.findAll({
  where: {
    role: { [Op.in]: ['admin', 'manager'] },
    status: 'active'
  }
});
```

### Client Emails
Clients receive notifications based on their email in the database:
- Order confirmations
- Payment reminders
- Invoice notifications

## 🔍 Testing Notifications

### Manual Testing

#### 1. Test Password Reset
```bash
# Request reset
POST http://localhost:5000/api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "admin@example.com"
}

# Response includes resetUrl in development mode
# Use token to reset password
PUT http://localhost:5000/api/v1/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

#### 2. Test Order Confirmation
Create a new order via the API - email sent automatically to client.

#### 3. Trigger Cron Jobs Manually
Temporarily change cron schedule to `*/1 * * * *` (every minute) for testing.

### Development Mode Features
- Password reset URL included in API response
- Email sending errors logged to console
- Cron job execution logged
- Email connection tested on startup

## 📊 Monitoring

### Email Service Logs
```
✅ Password reset email sent to user@example.com
✅ Order confirmation sent to client@example.com
✅ Low stock alert sent to admin@example.com
✅ Expiration warning sent to manager@example.com
✅ Payment reminder sent to client@example.com
✅ Daily production report sent to 3 recipients
```

### Cron Job Logs
```
📅 Low stock alert cron job started (runs daily at 9 AM)
🔍 Running low stock check...
✅ Low stock alert sent for 3 products

📅 Expiration warning cron job started (runs daily at 8 AM)
🔍 Running expiration check...
✅ Expiration warning sent for 2 batches
```

## 🛠️ Troubleshooting

### Email Not Sending
1. **Check credentials**: Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
2. **Gmail security**: Ensure 2FA enabled and app password created
3. **Network**: Check if port 587 is blocked by firewall
4. **Test connection**: Look for "✅ Email service is ready" on startup

### Wrong Email Template
1. **Check model fields**: Ensure correct property names (e.g., `order.total` not `order.totalAmount`)
2. **JSON parsing**: Items/tracking fields need JSON.parse() if stored as strings
3. **Associations**: Use correct alias (e.g., `batch.productRef` not `batch.Product`)

### Cron Jobs Not Running
1. **Check server logs**: Jobs log their schedule on startup
2. **Time zone**: Server uses system timezone
3. **Test schedule**: Change to `*/1 * * * *` for testing
4. **Manual trigger**: Call functions directly for debugging

### No Recipients
1. **Check user roles**: Ensure admins/managers exist with `status = 'active'`
2. **Client emails**: Verify clients have valid email addresses
3. **Database**: Confirm users table populated

## 🚀 Future Enhancements

### Potential Additions
- SMS notifications via Twilio
- In-app notification bell icon
- Notification preferences per user
- Email templates customization UI
- Notification history/audit log
- Webhook integrations
- Slack/Discord alerts
- Mobile push notifications
- Notification scheduling dashboard

### Settings Integration
Add to Settings page:
- Email notification toggles
- Notification frequency settings
- Custom email templates
- Test notification buttons
- Notification history viewer
- Email blacklist management

## 📝 API Endpoints Summary

### Authentication
```
POST   /api/v1/auth/forgot-password    # Request password reset
PUT    /api/v1/auth/reset-password/:token  # Reset password with token
PUT    /api/v1/auth/update-password    # Update password (authenticated)
```

### No Additional Endpoints Needed
All other notifications are triggered automatically:
- Order confirmations → On order creation
- Low stock alerts → Daily cron job
- Expiration warnings → Daily cron job
- Payment reminders → Daily cron job
- Production reports → Daily cron job

## 💡 Best Practices

### For Administrators
1. **Email Setup**: Use a dedicated email account for the system
2. **Testing**: Test all notifications in development before production
3. **Monitoring**: Check logs regularly for email failures
4. **Backups**: Keep backup of email templates
5. **Security**: Rotate email password periodically

### For Developers
1. **Error Handling**: All email functions include try-catch
2. **Logging**: Log all email activities
3. **Testing**: Test with real email addresses
4. **Templates**: Keep HTML templates maintainable
5. **Async**: Email sending is non-blocking

### For Users
1. **Spam Folder**: Check spam for password reset emails
2. **Email Addresses**: Keep client emails up to date
3. **Preferences**: Report notification issues to admin
4. **Action**: Respond to payment reminders promptly

## 📚 Code Structure

```
backend/src/
├── services/
│   ├── emailService.ts       # All email templates and sending logic
│   └── cronJobs.ts           # Scheduled job definitions
├── controllers/
│   ├── authController.ts     # Password reset endpoints
│   └── orderController.ts    # Order confirmation trigger
└── server.ts                 # Cron job initialization

frontend/src/
├── pages/Auth/
│   ├── PasswordRecovery.tsx  # Request reset page
│   └── ResetPassword.tsx     # Reset password page
└── services/
    └── api.ts                # API methods for password reset
```

## ✅ Checklist

### Backend Setup
- [x] Email service created with nodemailer
- [x] Password reset endpoints
- [x] Order confirmation on creation
- [x] Low stock alert cron job
- [x] Expiration warning cron job
- [x] Payment reminder cron job
- [x] Daily production report cron job
- [x] Email connection test on startup
- [x] Graceful shutdown for cron jobs
- [x] Environment variables documented

### Frontend Setup
- [x] Password recovery page
- [x] Reset password page
- [x] API methods for password reset
- [x] Routes configured
- [x] Error handling
- [x] Success feedback
- [x] Loading states

### Testing
- [ ] Gmail app password configured
- [ ] Password reset flow tested
- [ ] Order confirmation email received
- [ ] Low stock alert verified
- [ ] Expiration warning verified
- [ ] Payment reminder verified
- [ ] Daily report verified
- [ ] All cron jobs logging correctly

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Test email connection
4. Verify environment variables
5. Check database for user emails

---

**Last Updated**: December 23, 2025
**Version**: 1.0.0
**Status**: ✅ Fully Implemented
