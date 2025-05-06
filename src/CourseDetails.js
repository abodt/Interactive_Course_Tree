import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, getLinksByCourseId } from "./Api";
import { FaFilePdf, FaWpforms, FaUpload } from "react-icons/fa";
import "./CourseDetailsStyle.css";
import SocialIcons from "./SocialIcons";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFiles, setShowFiles] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const courseData = await getCourseById(courseId);
      const linkData = await getLinksByCourseId(courseId);

      setCourse(courseData);
      setLinks(linkData);
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

  if (loading) return <div className="body">Loading...</div>;
  if (!course) return <div className="body">Course not found.</div>;

  const publishedLinks = links.filter((link) => link.status === "published");
  const youtubeLinks = publishedLinks.filter((link) => link.type_of_link === "youtube");
  const pdfLinks = publishedLinks.filter((link) => link.type_of_link === "pdf");
  const formLinks = publishedLinks.filter((link) => link.type_of_link === "form");

  const handleUploadClick = () => {
    navigate("/upload-materials");
  };

  return (
    <div className="course-container">
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
          hebron@university.com | +99090909 : تواصل معنا عبر
        </span>
      </nav>

      <>
        {/* YouTube Video */}
        {youtubeLinks.length > 0 && (
          <div>
            <iframe
              className="container-vide"
              width="560"
              height="315"
              src={youtubeLinks[0].link.replace("watch?v=", "embed/")}
              title="YouTube Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="div1">
          <h1 className="course-title">{course.Name}</h1>
          <button className="upload-button" onClick={handleUploadClick}>
            <FaUpload className="icon" />
            إضافة مواد دراسية
          </button>
        </div>

        <p className="course-description">{course.Description}</p>

        {/* PDF Files */}
        <h2 className="section-title" onClick={() => setShowFiles(!showFiles)}>
          ملفات المساق
        </h2>
        {showFiles && (
          pdfLinks.length > 0 ? (
            <div className="card-list">
              {pdfLinks.map((pdf) => (
                <div key={pdf.id} className="card pdf-card">
                  <FaFilePdf className="card-icon" />
                  <h3 className="card-title">{pdf.link_title}</h3>
                  <a
                    href={pdf.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-button"
                  >
                    مشاهدة الملف
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>لا توجد ملفات متاحة حاليًا.</p>
          )
        )}

        {/* Forms */}
        <h2 className="section-title" onClick={() => setShowForms(!showForms)}>
          نماذج
        </h2>
        {showForms && (
          formLinks.length > 0 ? (
            <div className="card-list">
              {formLinks.map((form) => (
                <div key={form.id} className="card form-card">
                  <FaWpforms className="card-icon" />
                  <h3 className="card-title">{form.link_title}</h3>
                  <a
                    href={form.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-button"
                  >
                    الذهاب إلى النموذج
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p >لا توجد نماذج متاحة حاليًا.</p>
          )
        )}
      </>

      <footer className="footer">
        <p>© 2025 جميع الحقوق محفوظة - تصميم وتطوير</p>
        <div>
          <SocialIcons />
        </div>
      </footer>
    </div>
  );
};

export default CourseDetails;