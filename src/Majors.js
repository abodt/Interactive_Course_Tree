import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMajorsByDepartment, getPlanYearsByMajor } from "./Api";
import "./MajorsStyle.css";
import "./CollegStyle.css";
import SocialIcons from "./SocialIcons";

const Majors = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const data = await getMajorsByDepartment(departmentId);
        setMajors(data);
      } catch (error) {
        console.error("Error fetching majors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, [departmentId]);

  const handleBack = () => navigate(-1);

  const handleViewCourses = async (majorId) => {
    try {
      const planYears = await getPlanYearsByMajor(majorId);
      const selectedPlanYear = planYears.find(
        (plan) => plan.Major_id === majorId
      );

      if (selectedPlanYear) {
        navigate(`/majors/${majorId}/courses/${selectedPlanYear.id}`);
      } else {
        alert("No valid plan year found for this major.");
      }
    } catch (error) {
      console.error("Error fetching plan years for major:", error);
    }
  };

  // في حالة التحميل سيتم عرض الـ Loader
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">جاري تحميل التخصصات...</p>
      </div>
    );
  }

  return (
    <div className="majors-container">
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
          hebron@university.com | +99090909 : تواصل معنا عبر{" "}
        </span>
        <button onClick={handleBack} className="back-button">
          العودة إلى الأقسام ←
        </button>
      </nav>

      <header>
        <img
          src="/hebronuniversity.jpg"
          alt="Hebron University"
          className="college-container-img"
        />
      </header>
      <h1 className="majors-title">التخصصات المتاحة</h1>

      <div className="majors-list">
        {majors.map((major) => (
          <button
            key={major.id}
            onClick={() => handleViewCourses(major.id)}
            className="major-card"
          >
            <div>
              <h2 className="major-name">{major.Name}</h2>
              <p className="major-description">{major.Description}</p>
              <div className="major-hours">مجموع الساعات: {major.Hours}</div>
              <div className="show-plan">أظهر خطة التخصص</div>
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

export default Majors;