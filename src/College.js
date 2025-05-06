import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLaptop,
  FaCalculator,
  FaRunning,
  FaBook,
  FaFlask,
  FaSeedling,
  FaChartLine,
  FaUserNurse,
  FaChalkboardTeacher,
  FaBalanceScale,
  FaPenNib,
  FaUniversity,
  FaPills,
  FaUserMd
} from "react-icons/fa";
import "./CollegStyle.css";
import "./MajorsStyle.css";
import SocialIcons from "./SocialIcons";
import { getColleges } from "./Api"; // Updated import

const College = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon for colleges
  const getCollegeIcon = (name) => {
    switch (name.toLowerCase()) {
      case "كلية تكنولوجيا المعلومات":
        return <FaLaptop className="college-icon" />;
      case "كلية الرياضيات":
        return <FaCalculator className="college-icon" />;
      case "كلية الرياضة":
        return <FaRunning className="college-icon" />;
      case "كلية الشريعة":
        return <FaBook className="college-icon" />;
      case "كلية العلوم والتكنولوجيا":
        return <FaFlask className="college-icon" />;
      case "كلية الزراعة":
        return <FaSeedling className="college-icon" />;
      case "كلية التمويل والادارة":
        return <FaChartLine className="college-icon" />;
      case "كلية التمريض":
        return <FaUserNurse className="college-icon" />;
      case "كلية التربية":
        return <FaChalkboardTeacher className="college-icon" />;
      case "كلية الصيدلة والعلوم الطبية":
        return <FaPills className="college-icon" />;
      case "كلية الحقوق والعلوم السياسية":
        return <FaBalanceScale className="college-icon" />;
      case "كلية الآداب":
        return <FaPenNib className="college-icon" />;
      case "كلية الطب البشري":
        return <FaUserMd className="college-icon" />;
      default:
        return <FaUniversity className="college-icon" />;
    }
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await getColleges();
        setColleges(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleCollegeClick = (collegeId) => {
    navigate(`/departments/${collegeId}`);
  };

 

  // في حالة التحميل سيتم عرض الـ Loader تم تعديلة واضافةclassName جديد
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">جاري تحميل الكليات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p className="loading-text">حدث خطأ أثناء تحميل الكليات: {error}</p>
      </div>
    );
  }

  return (
    <div className="college-container">
      <nav className="back-bar">
        <a
          href="https://www.hebron.edu"
          target="_blank"
          rel="noopener noreferrer"
          className="university-link"
        >
          زيارة موقع الجامعة
        </a>
        
        <span className="contact-info">
          {" "}
          hebron@university.com |+99090909 : تواصل معنا عبر{" "}
        </span>
      </nav>
      
      <header>
        <img
          src="/hebronuniversity.jpg"
          alt="Hebron University"
          className="college-container-img"
        />
      </header>

      <h1 className="college-title">كليات جامعة الخليل</h1>

      <div className="college-list">
        {colleges.map((college) => (
          <button
          key={college.id}
          onClick={() => handleCollegeClick(college.id)}
          className="college-button"
        >
            <div className="college-content">
            <div className="college-icon">{getCollegeIcon(college.Name)}</div>
            <h2 className="college-name">{college.Name}</h2>
            <p className="college-description">{college.Description}</p>
            </div>
        </button>
        ))}
      </div>

      <footer className="footer">
      <p>© 2025 جميع الحقوق محفوظة - تصميم وتطوير</p>
        <div>
          <SocialIcons />
        </div>
      </footer>
    </div>
  );
};

export default College;