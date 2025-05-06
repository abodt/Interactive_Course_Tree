import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCode, FaBalanceScale, FaBook, FaBusinessTime, FaGlobe, FaShieldAlt,
  FaFlask, FaLeaf, FaCalculator, FaTree, FaPaw, FaTint, FaUtensils, FaChartLine,
  FaChalkboardTeacher, FaBrain, FaUserNurse, FaBaby, FaMoneyBillWave, FaUniversity,
  FaBullhorn, FaPills, FaMicroscope, FaRadiation, FaXRay, FaBuilding, FaGavel,
  FaExclamationTriangle
} from "react-icons/fa";

import { getCollegeById, getDepartmentsByCollege } from "./Api";
import './DepartmentStyle.css';
import './CollegStyle.css';
import "./MajorsStyle.css";
import SocialIcons from "./SocialIcons";

const Department = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDepartmentIcon = (name) => {
    switch (name.toLowerCase()) {
      case "قسم علم الحاسوب": return <FaCode className="department-icon" />;
      case "قسم اصول الدين": return <FaBook className="department-icon" />;
      case "قسم إدارة الأعمال": return <FaBusinessTime className="department-icon" />;
      case "قسم تكنولوجيا الويب والوسائط المتعددة": return <FaGlobe className="department-icon" />;
      case "قسم أمن وحماية شبكات الحاسوب": return <FaShieldAlt className="department-icon" />;
      case "قسم الكيمياء": return <FaFlask className="department-icon" />;
      case "قسم الأحياء": return <FaLeaf className="department-icon" />;
      case "قسم الرياضيات": return <FaCalculator className="department-icon" />;
      case "قسم علوم و تكنولوجيا البيئة": return <FaTree className="department-icon" />;
      case "قسم الانتاج النباتي والوقاية": return <FaLeaf className="department-icon" />;
      case "قسم تكنولوجيا الانتاج الحيواني": return <FaPaw className="department-icon" />;
      case "قسم التربة والري": return <FaTint className="department-icon" />;
      case "قسم التغذية والتصنيع الغذائي": return <FaUtensils className="department-icon" />;
      case "قسم الاقتصاد الزراعي والارشاد": return <FaChartLine className="department-icon" />;
      case "قسم اصول التربية": return <FaChalkboardTeacher className="department-icon" />;
      case "قسم علم النفس": return <FaBrain className="department-icon" />;
      case "قسم علوم التمريض": return <FaUserNurse className="department-icon" />;
      case "قسم القبالة": return <FaBaby className="department-icon" />;
      case "قسم العلوم المالية والمحاسبية": return <FaMoneyBillWave className="department-icon" />;
      case "قسم الادارة العامة": return <FaUniversity className="department-icon" />;
      case "قسم التسويق الرقمي الريادي": return <FaBullhorn className="department-icon" />;
      case "قسم الصيدلة": return <FaPills className="department-icon" />;
      case "قسم العلوم الطبية المخبرية": return <FaMicroscope className="department-icon" />;
      case "قسم الفيزياء الطبية الحيوية": return <FaRadiation className="department-icon" />;
      case "قسم التصوير الطبي": return <FaXRay className="department-icon" />;
      case "قسم العلوم السياسية": return <FaBalanceScale className="department-icon" />;
      case "قسم الفقه والقانون ": return <FaGavel className="department-icon" />;
      default: return <FaBuilding className="department-icon" />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeData = await getCollegeById(collegeId);
        setCollege(collegeData);
        const departmentsData = await getDepartmentsByCollege(collegeId);
        setDepartments(departmentsData);
      } catch (err) {
        setError(err.message);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => navigate("/");

  const handleToMajor = (DepartmentId) => {
    navigate(`/Majors/${DepartmentId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">جاري تحميل الأقسام، الرجاء الانتظار...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <p className="error-message">حدث خطأ أثناء تحميل البيانات: {error}</p>
      </div>
    );
  }

  return (
    <div className="college-container">
      <nav className="back-bar">
        <a href="https://www.hebron.edu" target="_blank" rel="noopener noreferrer" className="university-link">
          زيارة موقع الجامعة
        </a>
        <span className="contact-info"> hebron@university.com | +99090909 : تواصل معنا عبر </span>
        <button onClick={handleBack} className="back-button"> العودة إلى الكليات  ← </button>
      </nav>

      <header>
        <img src="/hebronuniversity.jpg" alt="Hebron University" className="college-container-img" />
      </header>

      <h1 className="college-title">أقسام {college?.Name}</h1>

      <div className="college-list">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() => handleToMajor(department.id)}
            className="college-button"
          >
            <div className="flex flex-col items-center">
              <div className="college-icon">{getDepartmentIcon(department.Name)}</div>
              <h2 className="college-name">{department.Name}</h2>
              <p className="college-description">{department.Description}</p>
            </div>
          </button>
        ))}
      </div>

      <footer className="footer">
        <p>© 2025 جميع الحقوق محفوظة - تصميم وتطوير</p>
        <div><SocialIcons /></div>
      </footer>
    </div>
  );
};

export default Department;