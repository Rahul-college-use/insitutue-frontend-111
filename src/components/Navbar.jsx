import { useState } from 'react';
import { GraduationCap, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ FIXED: Consuming parent authentication states via props
export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); 
    const [activeDropdown, setActiveDropdown] = useState(null);

    // ✅ FIXED: Adaptive calculation fallback using dynamic states + localStorage checks
    const isAlreadyLoggedIn = isAuthenticated || !!localStorage.getItem('token');
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';

    const menuData = {
        internships: [
            { name: "Web Development", path: "#" },
            { name: "Data Science", path: "#" },
            { name: "Cybersecurity", path: "#" },
            { name: "Digital Marketing", path: "#" }
        ],
        engineering: [
            { name: "Computer Science (CSE)", path: "#" },
            { name: "Civil Engineering", path: "#" },
            { name: "Mechanical Engineering", path: "#" },
            { name: "Electrical Engineering", path: "#" }
        ],
        ugcPrograms: [
            { name: "BCA Tracks", path: "#" },
            { name: "B.Sc Programs", path: "#" },
            { name: "B.A. Specializations", path: "#" },
            { name: "B.Com. Commerce", path: "#" }
        ]
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setActiveDropdown(null); 
    };

    const toggleDropdown = (menuKey) => {
        setActiveDropdown(activeDropdown === menuKey ? null : menuKey);
    };

    const handleDashboardRedirect = () => {
        setIsOpen(false);
        // ✅ FIXED: Smart routing role gateway checks
        if (isAdminUser) {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleRegister = () => {
        setIsOpen(false);
        navigate('/register'); 
    };

    const handleLogin = () => {
        setIsOpen(false);
        navigate('/login'); 
    };

    return (
        <header className="border-b border-slate-100 bg-white/95 backdrop-blur-md w-full relative z-40">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 box-border">

                {/* Logo Container */}
                <div onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate('/'); }} className="flex items-center gap-2 cursor-pointer shrink-0">
                    <div className="w-10 h-10 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200 shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden sm:block min-w-0">
                        <div className="text-base md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                            Make <span className="text-[#ff9900]">Intern</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Learn. Intern. Grow.</div>
                    </div>
                    <div className="block sm:hidden text-base font-black text-slate-900">
                        Make<span className="text-[#ff9900]">Intern</span>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden xl:flex items-center gap-5 font-medium text-xs md:text-sm text-slate-600 mx-auto h-full">
                    <span onClick={() => navigate('/')} className="hover:text-[#0066ff] cursor-pointer font-semibold shrink-0">Home</span>

                    {/* Dropdown 1: Internships */}
                    <div className="relative group flex items-center h-full cursor-pointer">
                        <span className="flex items-center gap-0.5 hover:text-[#0066ff] transition shrink-0 py-2">
                            Internships <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                        </span>
                        <div className="absolute top-[calc(100%-8px)] left-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-48 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                            {menuData.internships.map((item, index) => (
                                <a key={index} href={item.path} className="block px-4 py-2 hover:bg-slate-50 hover:text-[#0066ff] text-xs sm:text-sm transition">{item.name}</a>
                            ))}
                        </div>
                    </div>

                    {/* Dropdown 2: Engineering */}
                    <div className="relative group flex items-center h-full cursor-pointer">
                        <span className="flex items-center gap-0.5 hover:text-[#0066ff] transition shrink-0 py-2">
                            Engineering <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                        </span>
                        <div className="absolute top-[calc(100%-8px)] left-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-56 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                            {menuData.engineering.map((item, index) => (
                                <a key={index} href={item.path} className="block px-4 py-2 hover:bg-slate-50 hover:text-[#0066ff] text-xs sm:text-sm transition">{item.name}</a>
                            ))}
                        </div>
                    </div>

                    {/* Dropdown 3: UGC Programs */}
                    <div className="relative group flex items-center h-full cursor-pointer">
                        <span className="flex items-center gap-0.5 hover:text-[#0066ff] transition shrink-0 py-2">
                            UGC Programs <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                        </span>
                        <div className="absolute top-[calc(100%-8px)] left-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-52 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                            {menuData.ugcPrograms.map((item, index) => (
                                <a key={index} href={item.path} className="block px-4 py-2 hover:bg-slate-50 hover:text-[#0066ff] text-xs sm:text-sm transition">{item.name}</a>
                            ))}
                        </div>
                    </div>

                    <a href="#" className="hover:text-[#0066ff] transition shrink-0">Certificate Verify</a>
                    <a href="#" className="hover:text-[#0066ff] transition shrink-0">Colleges</a>
                    <a href="#" className="hover:text-[#0066ff] transition shrink-0">Success Stories</a>
                    <a href="#" className="hover:text-[#0066ff] transition shrink-0">Contact</a>
                </nav>

                {/* Right Actions Block (Conditional Auth Links) */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {isAlreadyLoggedIn ? (
                        <button onClick={handleDashboardRedirect} className="bg-[#0066ff] text-white px-4 py-2 rounded-md font-semibold text-xs md:text-sm hover:bg-blue-700 shadow-md shadow-blue-100 transition shrink-0">
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <button onClick={handleLogin} className="border border-slate-300 text-[#0066ff] px-3 md:px-4 py-2 rounded-md font-semibold text-xs md:text-sm hover:bg-slate-50 transition shrink-0">
                                Login
                            </button>
                            <button onClick={handleRegister} className="bg-[#ff9900] text-white px-3 md:px-4 py-2 rounded-md font-semibold text-xs md:text-sm hover:bg-opacity-95 shadow-md shadow-orange-100 transition shrink-0">
                                Register
                            </button>
                        </>
                    )}

                    <button
                        onClick={toggleMenu}
                        className="flex xl:hidden text-slate-600 hover:text-slate-900 focus:outline-none p-1.5 rounded-lg hover:bg-slate-50 transition shrink-0"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Dropdown Accordion Panel */}
            {isOpen && (
                <div className="xl:hidden bg-white border-t border-slate-100 absolute top-20 left-0 right-0 w-full shadow-xl z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="px-4 pt-4 pb-6 space-y-2 font-medium text-slate-700 flex flex-col">
                        <span onClick={() => { navigate('/'); toggleMenu(); }} className="bg-blue-50 text-[#0066ff] px-3 py-2 rounded-lg font-semibold cursor-pointer">Home</span>

                        {/* Mobile Accordion 1: Internships */}
                        <div>
                            <button
                                onClick={() => toggleDropdown('internships')}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
                            >
                                <span>Internships</span>
                                <ChevronDown className={`w-4 h-4 opacity-60 transition-transform ${activeDropdown === 'internships' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'internships' && (
                                <div className="pl-6 pr-4 py-1 bg-slate-50/50 rounded-lg mt-1 space-y-1">
                                    {menuData.internships.map((item, idx) => (
                                        <a key={idx} href={item.path} className="block py-2 text-sm text-slate-600 hover:text-[#0066ff]">{item.name}</a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Accordion 2: Engineering */}
                        <div>
                            <button
                                onClick={() => toggleDropdown('engineering')}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
                            >
                                <span>Engineering</span>
                                <ChevronDown className={`w-4 h-4 opacity-60 transition-transform ${activeDropdown === 'engineering' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'engineering' && (
                                <div className="pl-6 pr-4 py-1 bg-slate-50/50 rounded-lg mt-1 space-y-1">
                                    {menuData.engineering.map((item, idx) => (
                                        <a key={idx} href={item.path} className="block py-2 text-sm text-slate-600 hover:text-[#0066ff]">{item.name}</a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Accordion 3: UGC Programs */}
                        <div>
                            <button
                                onClick={() => toggleDropdown('ugcPrograms')}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
                            >
                                <span>UGC Programs</span>
                                <ChevronDown className={`w-4 h-4 opacity-60 transition-transform ${activeDropdown === 'ugcPrograms' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'ugcPrograms' && (
                                <div className="pl-6 pr-4 py-1 bg-slate-50/50 rounded-lg mt-1 space-y-1">
                                    {menuData.ugcPrograms.map((item, idx) => (
                                        <a key={idx} href={item.path} className="block py-2 text-sm text-slate-600 hover:text-[#0066ff]">{item.name}</a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a href="#" className="px-3 py-2.5 rounded-lg hover:bg-slate-50">Certificate Verify</a>
                        <a href="#" className="px-3 py-2.5 rounded-lg hover:bg-slate-50">Colleges</a>
                        <a href="#" className="px-3 py-2.5 rounded-lg hover:bg-slate-50">Success Stories</a>
                        <a href="#" className="px-3 py-2.5 rounded-lg hover:bg-slate-50">Contact</a>
                    </div>
                </div>
            )}
        </header>
    );
}