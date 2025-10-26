const db = require('../database/init');

// Audit logging middleware
const auditLogger = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      logAuditEvent({
        action,
        userId: req.user ? req.user.id : null,
        userEmail: req.user ? req.user.email : null,
        userRole: req.user ? req.user.role : null,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
        requestBody: sanitizeForLog(req.body),
        responseData: sanitizeForLog(data)
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Log audit events to database
const logAuditEvent = (event) => {
  // In production, you might want to use a separate audit database
  db.run(`
    INSERT OR IGNORE INTO audit_logs 
    (action, user_id, user_email, user_role, ip_address, user_agent, method, path, status_code, timestamp, request_data, response_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    event.action,
    event.userId,
    event.userEmail,
    event.userRole,
    event.ip,
    event.userAgent,
    event.method,
    event.path,
    event.statusCode,
    event.timestamp,
    JSON.stringify(event.requestBody),
    typeof event.responseData === 'string' ? event.responseData.substring(0, 1000) : JSON.stringify(event.responseData).substring(0, 1000)
  ], (err) => {
    if (err) {
      console.error('Audit logging error:', err);
    }
  });
};

// Sanitize sensitive data for logging
const sanitizeForLog = (data) => {
  if (!data) return null;
  
  const sensitive = ['password', 'token', 'apiKey', 'secret'];
  const sanitized = JSON.parse(JSON.stringify(data));
  
  const sanitizeObject = (obj) => {
    Object.keys(obj).forEach(key => {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    });
  };
  
  if (typeof sanitized === 'object') {
    sanitizeObject(sanitized);
  }
  
  return sanitized;
};

// Create audit logs table
const initAuditTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      user_id INTEGER,
      user_email TEXT,
      user_role TEXT,
      ip_address TEXT,
      user_agent TEXT,
      method TEXT,
      path TEXT,
      status_code INTEGER,
      timestamp TEXT,
      request_data TEXT,
      response_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating audit_logs table:', err);
    } else {
      console.log('Audit logs table ready');
    }
  });
};

module.exports = {
  auditLogger,
  logAuditEvent,
  initAuditTable
};