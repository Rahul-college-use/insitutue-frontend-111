// const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// const API_BASE_URL = isLocalhost
//   ? 'http://localhost:3000/api/auth'
//   : 'https://internshipplace-bend.vercel.app/api/auth';

// export const apiService = {



//   /////////////Admin 

//   ///courses getcourese
//   getCourses: async () => {
//     const response = await fetch(`${API_BASE_URL}/coursesData`)
//     // console.log(response)
//     return await response.json()

//   },

//   ///////// course delete by course manager
//   deleteCourse: async (courseId) => {
//     const response = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/delete`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     });
//     return await response.json();
//   },

//   // ///////////Admin issue certificate
//   issueCertificate: async (payload) => {
//     const response = await fetch(`${API_BASE_URL}/admin/certificates/issue`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(payload)
//     });
//     return await response.json();
//   },
//   /// download certificate
//   downloadCertificate: async (studentId, docType) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/certificates/download/${studentId}?type=${docType}`, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });
//     // console.log("Download certificate response:", response);
//     return await response.json();
//   },
//   /// toggleChat
//   toggleChat: async (courseId, targetState) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/admin/toggle-chat/${courseId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ isChatEnabled: targetState })
//     });
//     return await response.json();
//   },
//   ///sendCourseNotification
//   sendCourseNotification: async (courseId, noticeText) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/admin/send-announcement`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         courseId,
//         title: `Broadcast Alert: Node Update`,
//         body: noticeText
//       })
//     });
//     return await response.json();
//   },

//   // ADD COURSE: Submit new course payload to backend
//   addCourse: async (courseData) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/coursesAdd`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(courseData)
//     });
//     return await response.json();
//   },
// ////// GET ANNOUNCEMENTS: Fetch live announcements for a specific user
//   getAnnouncements: async (token, userId) => {
//     const response = await fetch(`${API_BASE_URL}/announcements/live-feed?userId=${userId}`, {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     return await response.json();
//   },


// // GET STUDENTS: Fetch all students for admin verification desk
//   getStudents: async (token) => {
//     const response = await fetch(`${API_BASE_URL}/admin/students`, {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     return await response.json();
//   },

//   //updateStudentStatus 
//   updateStudentStatus: async (studentId, newStatus) => {
//     // console.log(`Updating student ID ${studentId} to status: ${newStatus}`);
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/admin/student-status/${studentId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ status: newStatus })
//     });
//     return await response.json();
//   },


//   ////// getCourseMatrix
//   getCourseMatrix: async (token) => {
//     const response = await fetch(`${API_BASE_URL}/admin/course-matrix`, {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     return await response.json();
//   },















//   // LOGIN: Authenticate user, store JWT token + user details profile locally
//   loginUser: async (email, password) => {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//       credentials: 'include'
//     });

//     const data = await response.json();

//     if (response.ok && data.success) {
//       // ✅ FIXED: Enforced structured data mapping to cleanly synchronize with App.jsx security wrappers
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userData', JSON.stringify(data.user));
//       localStorage.setItem('isAdmin', data.user?.isAdmin ? "true" : "false");
//       return data;
//     } else {
//       throw new Error(data.message || "Login verification failed");
//     }
//   },

//   // GET STORED USER: Fetch fresh profile data matching the stored token
//   getStoredUser: async () => {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No operational session token detected');

//     const response = await fetch(`${API_BASE_URL}/getStoredUser`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) throw new Error('Failed to synchronize user session profile');
//     return await response.json();
//   },

//   // LOGOUT: Remove local state trace objects entirely
//   logoutUser: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userData');
//     localStorage.removeItem('isAdmin'); // ✅ FIXED: Flushed administrative roles safely
//     return { success: true };
//   },

//   // FETCH USER DASHBOARD DATA: Fetch matching profile data via custom headers
//   getUserDashboardData: async (userId) => {
//     const token = localStorage.getItem('token');

//     const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch dashboard data');
//     return await response.json();
//   },

//   // REGISTER: Submit student onboarding payload record variables
//   registerUser: async (userData) => {
//     const response = await fetch(`${API_BASE_URL}/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//       credentials: 'include'
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Registration failed');

//     // Automatically log user in locally if register controller returns token
//     if (data.success && data.token) {
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userData', JSON.stringify(data.user));
//       localStorage.setItem('isAdmin', "false"); // Registers default as student context
//     }
//     return data;
//   },

//   // GET PROGRAMS: Fetch full published courses list matrix
//   getPrograms: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/coursesData`);
//       const data = await response.json();
//       if (data && data.success) {
//         return data.courses || [];
//       }
//       return [];
//     } catch (error) {
//       console.error("Error communicating with course catalog API:", error);
//       return [];
//     }
//   },

//   // ENROLL USER: Fire custom enrollment requests safely
//   enrollUser: async (courseId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/enroll`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ courseId })
//       });

//       return await response.json();
//     } catch (error) {
//       console.error("Error communicating with enrollment API:", error);
//       return { success: false, message: "Network connection failed. Please try again." };
//     }
//   },

//   // CHAT HISTORY: Poll historical chat sequences matching target streams
//   chathistory: async (courseId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/chat/history/${courseId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         }
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("Chat history network dynamic link error:", error);
//       throw error;
//     }
//   },

//   /* -----------------------------------------------------------------
//        CASCADING UI DROPDOWN COLLECTIONS (Synchronous Quick Reads)
//   ------------------------------------------------------------------- */
//   getUniversities: async () => MOCK_UNIVERSITIES,

//   getFilteredColleges: async (universityId, category) => {
//     return MOCK_COLLEGES.filter(
//       college => college.universityId === universityId && college.category === category
//     );
//   },

//   getDepartmentsByCategory: async (category) => {
//     return MOCK_DEPARTMENTS[category] || [];
//   },

//   // ✅ FIXED: Added attendance logging API integration
//   logCheckIn: async (payload) => { // 1. Removed the destructuring brackets here
//     console.log("Initiating attendance check-in network request...", payload);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/check-in`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         // 2. Add the JSON body payload stringification here!
//         body: JSON.stringify(payload)
//       });

//       return await response.json();
//     } catch (error) {
//       console.error("Attendance check-in network error:", error);
//       throw error;
//     }
//   },
//   // Inside services/api.js
//   checkAttendanceStatus: async (courseId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/check-status/${courseId}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("API error checking status:", error);
//       throw error;
//     }
//   },

//   getAttendanceLogs: async (userId) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/logs/${userId}`, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });
//     return await response.json();
//   },
//   //
//   getAdminSingleStudentLogs: async (studentId, courseId) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_BASE_URL}/admin/student-attendance/${studentId}/${courseId}`, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });
//     return await response.json();
//   }

// };

// // ====================================================================
// // STATIC MOCK COLLECTIONS DATA INTERFACES
// // ====================================================================
// const MOCK_UNIVERSITIES = [
//   { id: "aku", name: "Aryabhatta Knowledge University (AKU), Patna" },
//   { id: "bu", name: "Bihar University (BRABU), Muzaffarpur" },
//   { id: "ppu", name: "Patliputra University (PPU), Patna" }
// ];

// const MOCK_COLLEGES = [
//   { id: "gecj", name: "Government Engineering College, Jehanabad", universityId: "aku", category: "btech_diploma" },
//   { id: "gecg", name: "Government Engineering College, Gaya", universityId: "aku", category: "btech_diploma" },
//   { id: "anc", name: "Anugrah Narayan College (AN College), Patna", universityId: "ppu", category: "ugc" },
//   { id: "bdc", name: "B.D. College, Patna", universityId: "ppu", category: "ugc" },
//   { id: "ls", name: "Langat Singh College, Muzaffarpur", universityId: "bu", category: "ugc" }
// ];

// const MOCK_DEPARTMENTS = {
//   btech_diploma: [
//     { id: "cse", name: "Computer Science & Engineering" },
//     { id: "ece", name: "Electronics & Communication Engineering" },
//     { id: "me", name: "Mechanical Engineering" },
//     { id: "ce", name: "Civil Engineering" }
//   ],
//   ugc: [
//     { id: "bca", name: "Bachelor of Computer Applications (BCA)" },
//     { id: "bsc_it", name: "B.Sc. Information Technology" },
//     { id: "bcom", name: "Bachelor of Commerce (B.Com)" },
//     { id: "ba", name: "Bachelor of Arts (B.A.)" }
//   ]
// };



/**
 * ENVIRONMENT CONFIGURATION
 * Automatically detects if the application is running locally or on production.
 */
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
  ? 'http://localhost:3000/api/auth'
  : 'https://internshipplace-bend.vercel.app/api/auth';

export const apiService = {

  /* =================================================================
     ADMIN CONTROLLERS (Management & Policy Operations)
     ================================================================= */

  /**
   * Fetch all published courses list matrix
   */
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/coursesData`);
    return await response.json();
  },

  /**
   * Delete a specific course by its unique ID
   */
  deleteCourse: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  },

  /**
   * Issue a new certificate to a student
   */
  issueCertificate: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });
    return await response.json();
  },

  /**
   * Download student certificate based on document type
   */
  downloadCertificate: async (studentId, docType) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/certificates/download/${studentId}?type=${docType}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  },

  /**
   * Toggle room chat feature availability for a specific course
   */
  toggleChat: async (courseId, targetState) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/toggle-chat/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ isChatEnabled: targetState })
    });
    return await response.json();
  },

  /**
   * Broadcast/Send official notice announcement to an entire batch
   */
  sendCourseNotification: async (courseId, noticeText) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/send-announcement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId,
        title: `Broadcast Alert: Node Update`,
        body: noticeText
      })
    });
    return await response.json();
  },

  /**
   * Submit new course creation payload to the backend
   */
  addCourse: async (courseData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/coursesAdd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    return await response.json();
  },

  /**
   * Fetch live system alerts and feed announcements for a specific user
   */
  getAnnouncements: async (token, userId) => {
    const response = await fetch(`${API_BASE_URL}/announcements/live-feed?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return await response.json();
  },

  /**
   * Fetch all registered students for the admin verification desk
   */
  getStudents: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return await response.json();
  },

  /**
   * Update student onboarding verification status (e.g., pending, verified)
   */
  updateStudentStatus: async (studentId, newStatus) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/student-status/${studentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    return await response.json();
  },

  /**
   * Fetch system-wide core course-mapping metric matrix
   */
  getCourseMatrix: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/course-matrix`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return await response.json();
  },

  /* =================================================================
     AUTHENTICATION & USER SESSION SYSTEM
     ================================================================= */

  /**
   * Authenticate user, store secure session details profile locally
   */
  loginUser: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('isAdmin', data.user?.isAdmin ? "true" : "false");
      return data;
    } else {
      throw new Error(data.message || "Login verification failed");
    }
  },

  /**
   * Fetch fresh session profile data matching local token state
   */
  getStoredUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No operational session token detected');

    const response = await fetch(`${API_BASE_URL}/getStoredUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to synchronize user session profile');
    return await response.json();
  },

  /**
   * Flush local operational session trace objects entirely
   */
  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAdmin');
    return { success: true };
  },

  /**
   * Fetch user dashboard payload data metrics via user reference
   */
  getUserDashboardData: async (userId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  },

  /**
   * Submit student onboarding payload record variables to register
   */
  registerUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('isAdmin', "false");
    }
    return data;
  },

  /* =================================================================
     STUDENT PLATFORM FEATURES (Programs & Classrooms)
     ================================================================= */

  /**
   * Fetch public dynamic course catalogs
   */
  getPrograms: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coursesData`);
      const data = await response.json();
      if (data && data.success) {
        return data.courses || [];
      }
      return [];
    } catch (error) {
      console.error("Error communicating with course catalog API:", error);
      return [];
    }
  },

  /**
   * Fire custom student programmatic program enrollment requests
   */
  enrollUser: async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      return await response.json();
    } catch (error) {
      console.error("Error communicating with enrollment API:", error);
      return { success: false, message: "Network connection failed. Please try again." };
    }
  },

  /**
   * Poll historical chat sequences matching target streams
   */
  chathistory: async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/chat/history/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Chat history network dynamic link error:", error);
      throw error;
    }
  },

  /* =================================================================
     CASCADING UI DROPDOWN COLLECTIONS (Synchronous Quick Reads)
     ================================================================= */

  getUniversities: async () => MOCK_UNIVERSITIES,

  getFilteredColleges: async (universityId, category) => {
    return MOCK_COLLEGES.filter(
      college => college.universityId === universityId && college.category === category
    );
  },

  getDepartmentsByCategory: async (category) => {
    return MOCK_DEPARTMENTS[category] || [];
  },

  /* =================================================================
     ATTENDANCE TRACKING SUBSYSTEM
     ================================================================= */

  /**
   * Log active student check-in daily logs session tracking
   */
  logCheckIn: async (payload) => {
    console.log("Initiating attendance check-in network request...", payload);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      return await response.json();
    } catch (error) {
      console.error("Attendance check-in network error:", error);
      throw error;
    }
  },

  /**
   * Check active attendance verification access state windows
   */
  checkAttendanceStatus: async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/check-status/${courseId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error("API error checking status:", error);
      throw error;
    }
  },

  /**
   * Fetch specific log tracking matrices for a single student profile
   */
  getAttendanceLogs: async (userId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/logs/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  },

  /**
   * [ADMIN] Fetch localized attendance sheets matching single user environments
   */
  getAdminSingleStudentLogs: async (studentId, courseId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/student-attendance/${studentId}/${courseId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  }

};

/* ====================================================================
   STATIC MOCK COLLECTIONS DATA INTERFACES
   ==================================================================== */
export const MOCK_UNIVERSITIES = [
  { id: "beu", name: "Bihar Engineering University (BEU), Patna" },
  { id: "aku", name: "Aryabhatta Knowledge University (AKU), Patna" },
  { id: "ppu", name: "Patliputra University (PPU), Patna" },
  { id: "brabu", name: "Babasaheb Bhimrao Ambedkar Bihar University (BRABU), Muzaffarpur" },
  { id: "lnmu", name: "Lalit Narayan Mithila University (LNMU), Darbhanga" },
  { id: "vksu", name: "Veer Kunwar Singh University (VKSU), Ara" },
  { id: "mmu", name: "Munger University, Munger" },
  { id: "purnea", name: "Purnea University, Purnea" },
  { id: "jpu", name: "Jai Prakash University (JPU), Chapra" },
  { id: "bnmu", name: "Bhupendra Narayan Mandal University (BNMU), Madhepura" },
  { id: "ksdsu", name: "Kameshwar Singh Darbhanga Sanskrit University" }
];

export const MOCK_COLLEGES = [
  // ===== BEU =====
  { id: "gecg", name: "Government Engineering College, Gaya", universityId: "beu", category: "btech_diploma" },
  { id: "gecj", name: "Government Engineering College, Jehanabad", universityId: "beu", category: "btech_diploma" },
  { id: "gecb", name: "Government Engineering College, Bhojpur", universityId: "beu", category: "btech_diploma" },
  { id: "gecva", name: "Government Engineering College, Vaishali", universityId: "beu", category: "btech_diploma" },
  { id: "mit", name: "Muzaffarpur Institute of Technology", universityId: "beu", category: "btech_diploma" },
  { id: "nitp", name: "Nalanda College of Engineering", universityId: "beu", category: "btech_diploma" },

  // ===== AKU =====
  { id: "bcet", name: "Bhagalpur College of Engineering", universityId: "aku", category: "btech_diploma" },
  { id: "gcegopal", name: "Gaya College of Engineering", universityId: "aku", category: "btech_diploma" },
  { id: "darbhanga_eng", name: "Darbhanga College of Engineering", universityId: "aku", category: "btech_diploma" },

  // ===== PPU =====
  { id: "anc", name: "Anugrah Narayan College, Patna", universityId: "ppu", category: "ugc" },
  { id: "bdc", name: "B.D. College, Patna", universityId: "ppu", category: "ugc" },
  { id: "patna_womens", name: "Patna Women's College", universityId: "ppu", category: "ugc" },

  // ===== BRABU =====
  { id: "ls", name: "Langat Singh College", universityId: "brabu", category: "ugc" },
  { id: "rds", name: "R.D.S. College", universityId: "brabu", category: "ugc" },
  { id: "mddm", name: "MDDM College", universityId: "brabu", category: "ugc" },

  // ===== LNMU =====
  { id: "cmscience", name: "C.M. Science College", universityId: "lnmu", category: "ugc" },
  { id: "mlsm", name: "M.L.S.M. College", universityId: "lnmu", category: "ugc" },

  // ===== VKSU =====
  { id: "hdjain", name: "H.D. Jain College", universityId: "vksu", category: "ugc" },
  { id: "maharaja", name: "Maharaja College", universityId: "vksu", category: "ugc" },

  // ===== Munger University =====
  { id: "rdrc", name: "R.D. & D.J. College", universityId: "mmu", category: "ugc" },

  // ===== Purnea University =====
  { id: "purnea_college", name: "Purnea College", universityId: "purnea", category: "ugc" },

  // ===== JPU =====
  { id: "rajendra", name: "Rajendra College, Chapra", universityId: "jpu", category: "ugc" },

  // ===== BNMU =====
  { id: "tpcollege", name: "T.P. College, Madhepura", universityId: "bnmu", category: "ugc" }
];
export const MOCK_DEPARTMENTS = {
  btech_diploma: [
    { id: "cse", name: "Computer Science & Engineering" },
    { id: "it", name: "Information Technology" },
    { id: "ai", name: "Artificial Intelligence & Data Science" },
    { id: "ece", name: "Electronics & Communication Engineering" },
    { id: "eee", name: "Electrical & Electronics Engineering" },
    { id: "ee", name: "Electrical Engineering" },
    { id: "me", name: "Mechanical Engineering" },
    { id: "ce", name: "Civil Engineering" },
    { id: "che", name: "Chemical Engineering" }
  ],

  ugc: [
    { id: "ba", name: "Bachelor of Arts (B.A.)" },
    { id: "bsc", name: "Bachelor of Science (B.Sc.)" },
    { id: "bcom", name: "Bachelor of Commerce (B.Com)" },
    { id: "bca", name: "Bachelor of Computer Applications (BCA)" },
    { id: "bba", name: "Bachelor of Business Administration (BBA)" },
    { id: "ma", name: "Master of Arts (M.A.)" },
    { id: "msc", name: "Master of Science (M.Sc.)" },
    { id: "mcom", name: "Master of Commerce (M.Com)" },
    { id: "mca", name: "Master of Computer Applications (MCA)" },
    { id: "mba", name: "Master of Business Administration (MBA)" }
  ]
};