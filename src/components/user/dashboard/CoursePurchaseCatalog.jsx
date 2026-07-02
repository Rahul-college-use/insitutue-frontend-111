import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../../../services/api';

export default function CoursePurchaseCatalog({ user, onPurchaseSuccess }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available programs directly out of your data service list
    apiService.getPrograms()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading course catalog view:", err);
        setLoading(false);
      });
  }, []);

  const handleCheckoutMock = async (courseId) => {
    // alert(`Redirecting to payment gateway for Course ID: ${courseId}`);
    // In production, integrate Razorpay/Stripe here.
    // On payment success, hit backend endpoint to update `selectCourse` to this courseId, then call onPurchaseSuccess()
    try {
      // 2. Hit our backend enrollment update route
      const result = await apiService.enrollUser(courseId);

      if (result.success) {
        alert("🎉 Payment Verified & Course Unlocked Successfully!");

        // 3. Trigger the callback prop to tell DashboardPage to refresh user data
        onPurchaseSuccess();
      } else {
        alert(`Enrollment failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Checkout process crashed:", err);
      alert("An unexpected error occurred during enrollment.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 font-medium text-sm animate-pulse">
          Loading catalog options...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Welcome, {user?.fullName || "Student"}! 🎓
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
          Your account registration is active. To unlock your verified industrial internship panels, daily logbooks, and live classes, please choose your program specialization track below.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 font-medium text-sm">
          No active course paths are currently available for purchase.
        </div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            // CHANGED: key updated to course._id to match MongoDB document IDs
            <div key={course._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">

              {/* Optional UI Bonus: Render the real database thumbnail image */}
              <div className="w-full h-40 bg-slate-100 overflow-hidden relative">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image path breaks
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                  }}
                />
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-wider uppercase text-[#0066ff] bg-blue-50 px-2.5 py-1 rounded-full w-fit mb-3">
                    {course.cert}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{course.courseName}</h4>
                  <p className="text-xs text-slate-400 font-bold mb-4 uppercase tracking-wide">{course.meta}</p>

                  {/* Truncated description rendering block */}
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-600 font-medium mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Live Industrial Mentorship
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Verified Experience Certificate
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckoutMock(course._id)}
                  className="w-full bg-[#ff9900] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-100 transition mt-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Enroll & Unlock Panel
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}