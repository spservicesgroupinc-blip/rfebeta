/**
 * RFE FOAM APP - BETA SIGN UP BACKEND
 * v3.5 - Fixed PDF Rendering & Added Debug Tools
 */

// --- BRANDING CONFIGURATION ---
const BRAND = {
  NAME: "RFE Foam App",
  COLOR_PRIMARY: "#E30613", 
  COLOR_DARK: "#0F172A",    
  COLOR_BG: "#F1F5F9",      
  COLOR_TEXT: "#334155",    
  YEAR: new Date().getFullYear()
};

const CONFIG = {
  FOLDER_NAME: "FoamApp_Pro_System_Files", 
  SHEET_NAME: "RFE_Beta_Signups_DB",
  TAB_NAME: "Signups",
  ADMIN_EMAIL: "russellconstruction9@gmail.com", 
  USER_SUBJECT: "Welcome to FoamApp Pro v3 Beta - Access & User Guide"
};

/**
 * 🛠️ DEBUGGING TOOL
 * Select 'testSystem' from the dropdown menu and click 'Run'.
 * It will simulate a signup and print results to the Execution Log.
 */
function testSystem() {
  const fakePayload = {
    name: "Test User",
    email: CONFIG.ADMIN_EMAIL, // Sends email to you for testing
    phone: "555-0199",
    survey: {
      q1_operationType: "Test Rig",
      q2_headaches: ["Paperwork", "Math"],
      q3_estimateMethod: "Napkin",
      q10_freeTier: "Yes"
    }
  };
  
  Logger.log("Starting Test...");
  try {
    const result = handleSignup(fakePayload);
    Logger.log("SUCCESS: " + JSON.stringify(result));
  } catch (e) {
    Logger.log("FAILURE: " + e.toString());
  }
}

/**
 * Main Entry Point (POST requests)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  // Wait up to 30s because PDF generation is slow
  if (!lock.tryLock(30000)) {
    return sendResponse('error', 'Server is busy. Please try again.');
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Invalid request: No data received.");
    }

    const request = JSON.parse(e.postData.contents);
    const { action, payload } = request;

    if (action === 'SUBMIT_BETA_SIGNUP') {
      const result = handleSignup(payload);
      return sendResponse('success', result);
    } else {
      throw new Error("Invalid Action");
    }

  } catch (error) {
    Logger.log("FATAL ERROR: " + error.toString());
    return sendResponse('error', error.toString());
  } finally {
    lock.releaseLock();
  }
}

/**
 * Core Logic
 */
function handleSignup(data) {
  const { name, email, phone, survey } = data;

  if (!name || !email) throw new Error("Name and Email are required.");

  // 1. Prepare Data
  const s = {
    q1: survey?.q1_operationType || "",
    q2: Array.isArray(survey?.q2_headaches) ? survey.q2_headaches.join(", ") : (survey?.q2_headaches || ""),
    q3: survey?.q3_estimateMethod || "",
    q4: survey?.q4_softwareHate || "",
    q5: survey?.q5_yieldLoss || "",
    q6: survey?.q6_dynamicPricing || "",
    q7: survey?.q7_gunDownCost || "",
    q8: Array.isArray(survey?.q8_dreamFeatures) ? survey.q8_dreamFeatures.join(", ") : (survey?.q8_dreamFeatures || ""),
    q9: survey?.q9_pricingSwitch || "",
    q10: survey?.q10_freeTier || ""
  };

  // 2. Save to Sheets
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = getOrCreateTab(ss);
    sheet.appendRow([
      new Date().toLocaleString(),
      name, email, phone || "",
      s.q1, s.q2, s.q3, s.q4, s.q5, s.q6, s.q7, s.q8, s.q9, s.q10,
      "PENDING_SETUP"
    ]);
  } catch (e) {
    Logger.log("Sheet Error: " + e.toString()); 
    // Continue running even if sheet fails, so we still send emails
  }

  // 3. Generate PDF (Now using Tables instead of Flexbox)
  let pdfGuide;
  try {
    pdfGuide = generateUserGuidePDF(name);
  } catch (e) {
    throw new Error("PDF Generation Failed: " + e.toString());
  }

  // 4. Send Emails
  try {
    MailApp.sendEmail({
      to: email,
      subject: CONFIG.USER_SUBJECT,
      htmlBody: createWelcomeEmail(name),
      name: BRAND.NAME,
      attachments: [pdfGuide]
    });

    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: `[New Lead] ${name} - Beta Signup`,
      htmlBody: createAdminEmail(name, email, phone, "Check Google Drive for DB", s)
    });
  } catch (e) {
    throw new Error("Email Sending Failed: " + e.toString());
  }

  return { message: "Signup successful" };
}

// ==========================================
// ROBUST PDF GENERATOR (TABLES ONLY)
// ==========================================

function generateUserGuidePDF(userName) {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; color: #333; margin: 20px; }
          
          /* Header */
          .header { border-bottom: 3px solid ${BRAND.COLOR_PRIMARY}; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: 900; color: ${BRAND.COLOR_DARK}; }
          .logo span { color: ${BRAND.COLOR_PRIMARY}; }
          .doc-title { font-size: 18px; font-weight: bold; color: #666; margin-top: 5px; }
          
          /* Typography */
          h1 { color: ${BRAND.COLOR_PRIMARY}; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px; }
          h2 { color: ${BRAND.COLOR_DARK}; font-size: 14px; margin-top: 15px; margin-bottom: 5px; }
          p, li { font-size: 11px; line-height: 1.5; margin-bottom: 8px; }
          
          /* Cards (Using Borders, no Flexbox) */
          .role-card { border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; margin-bottom: 10px; background: #fff; }
          .role-title { font-weight: bold; color: ${BRAND.COLOR_DARK}; font-size: 12px; }
          .login-cred { font-family: monospace; background: #eee; padding: 2px 5px; border-radius: 3px; }
          
          /* Install Table */
          .install-table { width: 100%; border-collapse: separate; border-spacing: 10px; }
          .install-cell { width: 33%; border: 1px solid #e2e8f0; padding: 10px; vertical-align: top; background: #fff; }
          
          .footer { width: 100%; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 10px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">RFE <span>FOAM APP</span></div>
          <div class="doc-title">Official Beta User Guide</div>
        </div>

        <div style="font-size: 10px; color: #666; margin-bottom: 20px;">
          Prepared for: <strong>${userName}</strong> | Date: ${new Date().toLocaleDateString()}
        </div>

        <h1>1. Installation (PWA)</h1>
        <p>FoamApp Pro is a Progressive Web App (PWA). This means you install it directly from the browser.</p>
        
        <!-- FIXED: Using Table instead of Flexbox -->
        <table class="install-table">
          <tr>
            <td class="install-cell">
              <strong>Mobile (iOS)</strong><br/><br/>
              Open in Safari. Tap 'Share' (square with arrow) -> <em>Add to Home Screen</em>.
            </td>
            <td class="install-cell">
              <strong>Mobile (Android)</strong><br/><br/>
              Open in Chrome. Tap menu (3 dots) -> <em>Install App</em>.
            </td>
            <td class="install-cell">
              <strong>Desktop</strong><br/><br/>
              Click the 'Install' icon (monitor with arrow) in the right side of the URL bar.
            </td>
          </tr>
        </table>

        <h1>2. User Roles & Access</h1>
        
        <div class="role-card">
          <div class="role-title">Admin Dashboard</div>
          <p>Control estimates, inventory, and company settings.</p>
          <p><strong>Login:</strong> Registered Email & Password</p>
        </div>

        <div class="role-card">
          <div class="role-title">Crew Dashboard (In-Rig)</div>
          <p>Simplified interface for field teams to view schedules and log usage.</p>
          <p><strong>Login:</strong> <span class="login-cred">Company ID</span> + <span class="login-cred">4-digit Crew PIN</span></p>
        </div>

        <h1>3. Admin Workflow</h1>
        
        <table width="100%" cellpadding="5">
          <tr>
            <td width="20%" style="font-weight:bold; color:${BRAND.COLOR_PRIMARY}">1. Deployment</td>
            <td>Marking an estimate as <strong>Work Order</strong> sends it to the Rig iPad.</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:${BRAND.COLOR_PRIMARY}">2. Status</td>
            <td>Crew hits 'Start Job' -> Your dashboard updates to 'In Progress'.</td>
          </tr>
          <tr>
            <td style="font-weight:bold; color:${BRAND.COLOR_PRIMARY}">3. Completion</td>
            <td>Crew submits actual material usage -> Inventory is deducted automatically.</td>
          </tr>
        </table>

        <h1>4. Crew Workflow (In-Rig)</h1>
        
        <h2>Time Tracking & Execution</h2>
        <p>Field personnel tap <strong>Start Job</strong> to begin tracking. Tapping the address automatically launches Maps Navigation.</p>

        <h2>Completion & Actuals</h2>
        <p>Once finished, the crew taps <strong>Complete Job</strong>. They are required to log:</p>
        <ul>
          <li>Exact chemical sets (A & B) consumed.</li>
          <li>Inventory items (poly, tape, blades) used.</li>
          <li>Upload "Before" & "After" photos.</li>
        </ul>

        <div class="footer">
          &copy; ${BRAND.YEAR} RFE Foam Equipment. Confidential Beta Documentation.
        </div>
      </body>
    </html>
  `;

  return Utilities.newBlob(htmlContent, MimeType.HTML).getAs(MimeType.PDF).setName("RFE_FoamPro_UserGuide.pdf");
}

// ==========================================
// EMAIL TEMPLATES
// ==========================================

function createWelcomeEmail(name) {
  return wrapEmailBody(`
    <h2 style="color: ${BRAND.COLOR_DARK}; margin-top: 0;">Welcome, ${name}!</h2>
    <p>Thank you for requesting access to <strong>FoamApp Pro v3 Beta</strong>.</p>
    <p>We have successfully received your registration.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid ${BRAND.COLOR_PRIMARY}; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px; color: ${BRAND.COLOR_DARK};">Next Steps</h3>
      <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: ${BRAND.COLOR_TEXT};">
        <li style="margin-bottom: 8px;"><strong>Download the Guide:</strong> We've attached the Official User Guide PDF to this email.</li>
        <li><strong>Wait for Credentials:</strong> You will receive a separate email containing your Admin Login and Crew PIN within 24 hours.</li>
      </ol>
    </div>
  `);
}

function createAdminEmail(name, email, phone, sheetUrl, s) {
  const row = (label, val) => `<tr><td style="padding: 8px; width: 140px; font-weight: bold; border-bottom: 1px solid #eee;">${label}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${val}</td></tr>`;
  
  return wrapEmailBody(`
    <h2 style="color: ${BRAND.COLOR_PRIMARY}; margin-top: 0;">🚀 New Beta Signup</h2>
    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
    </div>
    <h3 style="font-size: 14px; color: ${BRAND.COLOR_DARK};">Survey Responses</h3>
    <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 13px;">
      ${row("Operation", s.q1)}
      ${row("Headaches", s.q2)}
      ${row("Method", s.q3)}
      ${row("Hate Software", s.q4)}
      ${row("Dream Features", s.q8)}
    </table>
  `);
}

function wrapEmailBody(contentHtml) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${BRAND.COLOR_DARK}; padding: 25px; text-align: center; border-bottom: 4px solid ${BRAND.COLOR_PRIMARY};">
        <span style="color: #ffffff; font-size: 20px; font-weight: 800;">${BRAND.NAME}</span>
      </div>
      <div style="padding: 30px; color: ${BRAND.COLOR_TEXT}; line-height: 1.6;">${contentHtml}</div>
      <div style="background-color: ${BRAND.COLOR_BG}; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${BRAND.YEAR} RFE Foam Equipment.
      </div>
    </div>
  `;
}

// ==========================================
// HELPERS
// ==========================================

function getOrCreateSpreadsheet() {
  const folder = getOrCreateFolder();
  const files = folder.getFilesByName(CONFIG.SHEET_NAME);
  if (files.hasNext()) return SpreadsheetApp.open(files.next());
  const ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  return ss;
}

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.FOLDER_NAME);
}

function getOrCreateTab(ss) {
  let sheet = ss.getSheetByName(CONFIG.TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.TAB_NAME);
    if (ss.getSheetByName("Sheet1")) ss.deleteSheet(ss.getSheetByName("Sheet1"));
    const headers = [["Timestamp", "Name", "Email", "Phone", "Op Type", "Headaches", "Method", "Soft. Hate", "Yield Loss", "Pricing", "Gun Cost", "Features", "Switch?", "Free Tier?", "Status"]];
    const range = sheet.getRange(1, 1, 1, 15);
    range.setValues(headers).setFontWeight("bold").setBackground(BRAND.COLOR_PRIMARY).setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendResponse(status, dataOrMessage) {
  return ContentService.createTextOutput(JSON.stringify({
    status: status, 
    [status === 'success' ? 'data' : 'message']: dataOrMessage 
  })).setMimeType(ContentService.MimeType.JSON);
}