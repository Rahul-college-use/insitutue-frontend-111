// Helper to open a print window cleanly and close the window after printing or cancelling
const openPrintWindow = (title, contentHtml) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to generate and print documents.");
    return;
  }

  // Script to trigger print on load and close the tab when done/canceled
  const printAndCloseScript = `
    <script>
      window.onload = function() {
        // Delay slightly to ensure full CSS rendering before print
        setTimeout(function() {
          window.print();
        }, 100);

        // Automatically close the popup tab when user finishes or cancels print
        window.addEventListener('afterprint', function() {
          window.close();
        });
      };
    </script>
  `;

  // Remove any duplicate hardcoded print scripts inside contentHtml
  let cleanHtml = contentHtml.replace(/<script>[\s\S]*?<\/script>/gi, '');

  // Inject the controlled script before closing </body> tag
  const finalHtml = cleanHtml.includes('</body>')
    ? cleanHtml.replace('</body>', `${printAndCloseScript}</body>`)
    : cleanHtml + printAndCloseScript;

  printWindow.document.open();
  printWindow.document.write(finalHtml);
  printWindow.document.close();
};
// 1. Consent Form
export const handlePrintConsentLetter = (user) => {
    const html = `
    <!DOCTYPE html><html><head><title>Annexure-I Consent Letter</title>
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; color: #000; line-height: 1.5; padding: 20px; }
      .header { text-align: center; margin-bottom: 25px; }
      .header h2 { margin: 0; font-size: 22px; font-weight: 800; }
      .meta { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 20px; font-weight: bold; }
      .title { text-align: center; margin-bottom: 20px; }
      .title h3 { margin: 5px 0; font-size: 18px; text-transform: uppercase; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      table, th, td { border: 1px solid #000; }
      td { padding: 8px 12px; font-size: 13px; }
      td.label { font-weight: bold; width: 35%; }
      .sig { text-align: right; font-size: 13px; font-weight: bold; margin-top: 60px; }
    </style></head>
    <body>
      <div class="header"><h2>${user?.collegeId || 'Unknown College'}</h2></div>
      <div class="meta"><span>Letter No: __________________</span><span>Date: __________________</span></div>
      <div class="title"><h3>ANNEXURE I</h3><h3>CONSENT LETTER</h3><p><u>TO WHOM IT MAY CONCERN</u></p></div>
      <p style="font-size:13px;">As part of the curriculum of CBCS UG the students are required to undertake internship of minimum 04 credits (120 hours) in an organization. In this regard, I am introducing the below mentioned student with the following details for the purpose of internship:</p>
      <table>
        <tr><td class="label">Name of the Student</td><td>${user?.fullName || 'Unknown'}</td></tr>
        <tr><td class="label">Gender</td><td>${user?.gender || 'Male'}</td></tr>
        <tr><td class="label">Father's Name</td><td>${user?.parentName || 'Unknown'}</td></tr>
        <tr><td class="label">University Registration Number</td><td>${user?.universityReg || 'Unknown'}</td></tr>
        <tr><td class="label">University Roll Number</td><td>${user?.universityRoll || 'Unknown'}</td></tr>
        <tr><td class="label">Class with Semester</td><td>${user?.semester || 'Unknown'}</td></tr>
        <tr><td class="label">Mobile Number</td><td>${user?.contactNumber || 'Unknown'}</td></tr>
        <tr><td class="label">Email ID</td><td>${user?.emailAddress || 'Unknown'}</td></tr>
        <tr><td class="label">Emergency Contact Number</td><td>${user?.emergencyPhone || 'Unknown'}</td></tr>
      </table>
      <p style="font-size:12px;">The organization satisfying the requirement of the Internship as provided in the guidelines of the University are requested to consider the candidature of the above mentioned student for internship in your organization.</p>
      <div class="sig">Signature of the Head of the Department / College Internship Nodal Officer / Principal</div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Consent Letter', html);
};

// 2. Acceptance Letter
export const handlePrintAcceptanceLetter = (user) => {
    const letterDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const letterRefNo = `INTERN/${Math.floor(Math.random() * 100000)}`; // Random reference number for demonstration

    const html = `
    <!DOCTYPE html><html><head><title>Internship Offer Letter - ${user?.fullName}</title>
    <style>
      @page { size: A4; margin: 15mm; }
      body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #111; line-height: 1.4; }
      .header-logo { text-align: center; margin-bottom: 20px; }
      .header-logo h2 { color: #2563eb; margin: 0; font-size: 26px; }
      .title { text-align: center; font-size: 18px; font-weight: 800; margin: 20px 0; letter-spacing: 0.5px; }
      .meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      td { padding: 6px 0; font-size: 13px; }
      td.bold { font-weight: bold; width: 30%; }
      .sig-box { margin-top: 40px; font-size: 13px; }
    </style></head>
    <body>
      <div class="header-logo"><h2>Internship Place</h2><p style="font-size:10px; color:#555; margin:0;">Internship Place</p></div>
      <div class="title">INTERNSHIP ACCEPTANCE/OFFER LETTER</div>
      <div class="meta"><span>Letter Ref. No.: ${letterRefNo}</span><span>Date: ${letterDate}</span></div>
      <p style="font-size:13px;">To,<br><b>${user?.fullName || 'Unknown'}</b><br>Roll No. : ${user?.universityRoll || 'Unknown'}<br>College: ${user?.collegeId || 'Unknown'}</p>
      <p style="font-size:13px;">Dear Candidate,<br>We are pleased to accept your application and offer you an internship with <b>internship place</b>, an initiative of <b>INTERNSHIP PLACE</b>. Our organization satisfies all requirements provided in the internship guidelines of <b>${user?.universityId || 'Unknown University'}</b> for Undergraduate Programmes.</p>
      <table>
        <tr><td class="bold">Name of the Student</td><td>: ${user?.fullName || 'Unknown'}</td></tr>
        <tr><td class="bold">Internship Registration No.</td><td>: 019087</td></tr>
        <tr><td class="bold">College / Institution</td><td>: ${user?.collegeId || 'Unknown'}</td></tr>
        <tr><td class="bold">University Roll No.</td><td>: ${user?.universityRoll || 'Unknown'}</td></tr>
        <tr><td class="bold">Department & Semester</td><td>: ${user?.department || 'Unknown'} — ${user?.semester || '5th Semester'}</td></tr>
        <tr><td class="bold">Internship Domain</td><td>: ${user?.enrolledCourses.courseName || 'Unknown'}</td></tr>
        <tr><td class="bold">Internship Duration</td><td>: 120 Hours</td></tr>
      </table>
      <div class="sig-box"><b>${user?.fullName || 'Unknown'}</b><br>Managing Director<br>INTERNSHIP PLACE</div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Acceptance Letter', html);
};

// 3. Fee Receipt
export const handlePrintFeeReceipt = (user) => {
    const receiptDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const paymentId = `PAY-${Math.floor(Math.random() * 1000000000)}`; // Random payment ID for demonstration
    const amount = Math.abs(Math.floor(Math.random() * 1000)) || Math.abs(user?.feeAmount) || '0'; // Example amount, replace with actual fee amount if available
    const html = `
    <!DOCTYPE html><html><head><title>Fee Receipt - ${user?.fullName}</title>
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; padding: 20px; }
      .border-box { border: 2px solid #000; padding: 0; max-width: 700px; margin: auto; }
      .header { text-align: center; border-bottom: 1px solid #000; padding: 20px; }
      .title { text-align: center; border-bottom: 1px solid #000; padding: 10px; font-weight: bold; font-size: 18px; }
      table { width: 100%; padding: 20px; }
      td { padding: 8px; font-size: 14px; }
      td.bold { font-weight: bold; width: 35%; }
      .amount-box { border: 1px solid #000; margin: 20px; text-align: center; padding: 15px; font-size: 24px; font-weight: bold; }
      .footer { text-align: center; font-size: 11px; color: #555; padding: 15px; border-top: 1px solid #000; }
    </style></head>
    <body>
      <div class="border-box">
        <div class="header"><h1 style="color:#2563eb; margin:0;">Internship Place</h1></div>
        <div class="title">PAYMENT FEE RECEIPT</div>
        <table>
          <tr><td class="bold">Receipt Number</td><td>INTP-${user?.studentId || Math.random().toString(36).substr(2, 9)}</td></tr>
          <tr><td class="bold">Student Name</td><td>${user?.fullName || 'Unknown'}</td></tr>
          <tr><td class="bold">Roll Number</td><td>${user?.universityRoll || 'Unknown'}</td></tr>
          <tr><td class="bold">Department</td><td>${user?.department || 'Unknown'}</td></tr>
          <tr><td class="bold">Degree</td><td>UG</td></tr>
          <tr><td class="bold">Session</td><td>2023 - 2027</td></tr>
          <tr><td class="bold">University</td><td>${user?.universityId || 'Unknown University'}</td></tr>
          <tr><td class="bold">College</td><td>${user?.collegeId || 'Unknown College'}</td></tr>
          <tr><td class="bold">Internship Topic</td><td>${user?.enrolledCourses.courseName || 'Unknown'}</td></tr>
          <tr><td class="bold">Payment ID</td><td> ${paymentId} </td></tr>
          <tr><td class="bold">Payment Date</td><td>${receiptDate}</td></tr>
        </table>
        <div class="amount-box">Amount Received<br><span style="font-size:28px;">₹${amount}</span></div>
        <div class="footer">This is a computer generated receipt and does not require a physical signature.</div>
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Fee Receipt', html);
};

// 4. Daily Log Sheet
export const handlePrintDailyLog = (user) => {
    const html = `
    <!DOCTYPE html><html><head><title>Daily Log - ${user?.fullName}</title>
    <style>
      @page { size: A4; margin: 15mm; }
      body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
      .header { text-align: center; margin-bottom: 15px; }
      .header h2 { margin: 0; font-size: 16px; }
      .info-grid { border: 1px solid #000; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 10px; margin-bottom: 20px; }
      .line { border-bottom: 1px solid #000; margin: 15px 0; height: 25px; }
      .sig-area { margin-top: 60px; display: flex; justify-content: space-between; }
    </style></head>
    <body>
      <div class="header"><h2>Internship Place</h2><p style="margin:2px;"><b>${user?.collegeId || 'Internship Place'}</b></p><h3>DAILY LOG SHEET</h3></div>
      <div class="info-grid">
        <div><b>Student Name:</b> ${user?.fullName || 'Unknown'}</div>
        <div><b>Department:</b> ${user?.department || 'Unknown'}</div>
        <div><b>University Roll No.:</b> ${user?.universityRoll || 'Unknown'}</div>
        <div><b>University Registration No.:</b> ${user?.universityReg || 'Unknown'}</div>
        <div><b>Email Address:</b> ${user?.emailAddress || 'Unknown'}</div>
        <div><b>Phone Number:</b> ${user?.contactNumber || 'Unknown'}</div>
        <div><b>Emergency Contact:</b> ${user?.emergencyPhone || 'Unknown'}</div>
        <div><b>Enrolled Course Name :</b> ${user?.enrolledCourses.courseName || 'Unknown'}</div>
        <div><b>Student ID:</b> ${user?.studentId || 'Unknown'}</div>

        <div><b>Internship Duration:</b> 120 hours</div>
      </div>
      <p><b>📅 Date:</b> ___________________________</p>
      <p><b>📅 Day:</b> ___________________________</p>
      <p><b>📖 What I learned today:</b></p>
      <div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
      <div class="sig-area"><span>Student Signature</span><span>Date</span></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Daily Log Sheet', html);
};

// 5. Feedback Form
export const handlePrintFeedback = (user) => {
    const html = `
    <!DOCTYPE html><html><head><title>Internship Feedback - ${user?.fullName}</title>
    <style>
      @page { size: A4; margin: 15mm; }
      body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
      .header { text-align: center; margin-bottom: 15px; }
      .info-grid { border: 1px solid #000; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 10px; margin-bottom: 20px; }
      .line { border-bottom: 1px solid #000; margin: 20px 0; height: 30px; }
    </style></head>
    <body>
      <div class="header"><h2>Internship Place</h2><p><b>${user?.collegeId || 'Internship Place'}</b></p><h3>STUDENT FEEDBACK FORM</h3></div>
      <div class="info-grid">
        <div><b>Student Name:</b> ${user?.fullName || 'Unknown'}</div>
        <div><b>Department:</b> ${user?.department || 'Unknown'}</div>
        <div><b>University Roll No.:</b> ${user?.universityRoll || 'Unknown'}</div>
        <div><b>University Registration No.:</b> ${user?.universityReg || 'Unknown'}</div>
        <div><b>Email Address:</b> ${user?.emailAddress || 'Unknown'}</div>
        <div><b>Phone Number:</b> ${user?.contactNumber || 'Unknown'}</div>
        <div><b>Emergency Contact:</b> ${user?.emergencyPhone || 'Unknown'}</div>
        <div><b>Enrolled Course Name :</b> ${user?.enrolledCourses.courseName || 'Unknown'}</div>
        <div><b>Student ID:</b> ${user?.studentId || 'Unknown'}</div>
      </div>
      <p><b>📝 Your Feedback / Suggestions about the Internship:</b></p>
      <div class="line"></div><div class="line"></div>
      <p><b>🌟 Any areas of improvement you would like to share:</b></p>
      <div class="line"></div><div class="line"></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Feedback Form', html);
};

// 6. Marksheet
export const handlePrintMarksheet = (user) => {
    const html = `
    <!DOCTYPE html><html><head><title>Assessment Marksheet - ${user?.fullName}</title>
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; padding: 20px; }
      .header { text-align: center; margin-bottom: 25px; color: #1e3a8a; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      table, th, td { border: 1px solid #cbd5e1; }
      td { padding: 10px; font-size: 13px; }
      td.bold { font-weight: bold; background: #f8fafc; width: 35%; }
      .results { border-left: 4px solid #2563eb; padding-left: 15px; margin-top: 30px; }
    </style></head>
    <body>
      <div class="header"><h2>Internship Place</h2><p>A unit of Optimark Ventures Pvt Ltd</p><h3>ASSESSMENT MARKSHEET</h3></div>
      <table>
            <tr><td class="bold">Student Name</td><td>${user?.fullName || 'Unknown'}</td></tr>
            <tr><td class="bold">College Name</td><td>${user?.college || 'Internship Place'}</td></tr>
            <tr><td class="bold">University Roll No</td><td>${user?.universityRoll || 'Unknown'}</td></tr>
        <tr><td class="bold">University Registration No</td><td>${user?.universityReg || 'Unknown'}</td></tr>
            <tr><td class="bold">Department</td><td>${user?.department || 'Unknown'}</td></tr>
            <tr><td class="bold">Semester</td><td>${user?.semester || 'Unknown'}</td></tr>
        <tr><td class="bold">Internship Topic</td><td>${user?.enrolledCourses.courseName || 'Unknown'}</td></tr>
      </table>
      <div class="results">
        <h4 style="color:#1e3a8a; margin:0 0 10px 0;">Assessment Results</h4>
        <p>Score Percentage: <b>${Math.floor(Math.random() * 21)+79}%</b></p> 
        <p>Overall Performance: <b style="color:green;">Excellent</b></p>
        <p>Remarks: <b>Keep up the great work!</b></p>
        <p>Grade: <b>A+</b></p>
        <p>Status: <b style="color:green;">PASSED</b></p>
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Marksheet', html);
};

// 7. Certificate
export const handlePrintCertificate = (user) => {
    const html = `
    <!DOCTYPE html><html><head><title>Certificate - ${user?.fullName}</title>
    <style>
      @page { size: landscape; margin: 10mm; }
      body { font-family: 'Georgia', serif; text-align: center; padding: 30px; border: 10px solid #b45309; }
      h1 { font-size: 32px; color: #1e3a8a; }
      p { font-size: 16px; line-height: 1.8; }
    </style></head>
    <body>
      <h1>OPTIMARK VENTURES PVT. LTD.</h1>
      <h2>INTERNSHIP COMPLETION CERTIFICATE</h2>
      <p>This is to certify that <b>${user?.fullName || 'Unknown'}</b>, University Roll No. <b>${user?.universityRoll || 'Unknown'}</b> from <b>${user?.collegeId || 'Unknown'}</b> has successfully completed 120 hours of internship in <b>${user?.enrolledCourses.courseName || 'Unknown'}</b>.</p>
      <p>Grade Achieved: <b>A+ (86%)</b></p>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Certificate', html);
};

// 8. Department Certificate
export const handlePrintDepartmentCertificate = (user) => {
    const html = `
    <!DOCTYPE html><html><head><title>Department Certificate</title>
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; text-align: center; padding: 30px; line-height: 1.8; }
      .title { margin-top: 40px; font-weight: bold; font-size: 18px; }
      .content { text-align: justify; margin-top: 40px; font-size: 14px; }
      .sig { margin-top: 100px; text-align: left; font-weight: bold; }
    </style></head>
    <body>
      <h2>${user?.collegeId || 'Internship Place'}</h2>
      <hr style="border:1px solid #000;">
      <p><b>Annexure IV</b></p>
      <div class="title">CERTIFICATE ISSUED BY THE DEPARTMENT</div>
      <div class="content">
        This is to certify that <b>${user?.fullName || 'Unknown'}</b>, s/o <b>${user?.parentName || 'Unknown'}</b>, bearing University Roll No. <b>${user?.universityRoll || 'Unknown'}</b>, of programme <b>${user?.department || 'Unknown'}</b>, session <b>2023 - 2027</b>, has successfully completed his internship for a duration of <b>120 Hours</b> from <b>INTERNSHIP PLACE</b>.
        <br><br>
        He has also submitted the report of the internship after successful completion of the internship.
      </div>
      <div class="sig">Head of the Department of the College</div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
    openPrintWindow('Department Certificate', html);
};

// 9. Student Declaration
export const handlePrintDeclaration = (user) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Student Self Declaration</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px; 
          line-height: 1.8; 
          font-size: 13px; 
          color: #000;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h2 { margin: 0; font-size: 20px; text-transform: uppercase; }
        .header h3 { margin: 15px 0 0 0; font-size: 16px; text-transform: uppercase; text-decoration: underline; }
        ol { padding-left: 20px; }
        ol li { margin-bottom: 20px; text-align: justify; }
        .closing-text { margin-top: 30px; font-weight: normal; }
        .signature-section { 
          margin-top: 80px; 
          display: flex; 
          justify-content: space-between; 
          font-weight: bold;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>${user?.college || 'PEOPLES COLLEGE, ARARIA'}</h2>
        <hr style="border: none; border-top: 1px solid #000; margin-top: 10px;" />
        <h3>STUDENT SELF DECLARATION</h3>
      </div>

      <p style="margin-bottom: 20px;">
        I, <b>${user?.fullName || 'Unkonwn'}</b>, S/o <b>${user?.parentName || 'Unkonwn'}</b>, hereby solemnly declare that:
      </p>

      <ol>
        <li>I voluntarily joined the internship programme conducted by <b>InternShip Pace</b> of my own free will and without any coercion or undue influence.</li>
        <li>I have regularly attended the internship activities, completed the prescribed learning modules, participated in practical assignments, and fulfilled all academic requirements of the internship programme.</li>
        <li>I have successfully completed the online assessment/test conducted as part of the internship programme.</li>
        <li>The internship report submitted by me has been prepared independently by me based on my learning, practical experience, observations, and understanding acquired during the internship period.</li>
        <li>I declare that the internship report is my own original work and has not been copied, plagiarized, or submitted elsewhere for any academic or professional purpose.</li>
        <li>I further declare that all the information, documents, certificates, records, and details submitted by me in connection with this internship are true, correct, genuine, and complete to the best of my knowledge and belief.</li>
        <li>I understand that if any information furnished by me is found to be false, fabricated, misleading, or incorrect at any stage, the concerned authority or internship organization shall have the right to cancel my internship, certificate, and any related benefits without prior notice.</li>
      </ol>

      <p class="closing-text">
        I hereby affirm that the above statements are true and correct to the best of my knowledge and belief.
      </p>

      <div class="signature-section">
        <div>
          Date: __________________
        </div>
        <div style="text-align: right;">
          __________________________<br />
          Signature of Student
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
  openPrintWindow('Student Declaration', html);
};