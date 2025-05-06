import { useState } from "react";
import { uploadMaterial } from "./Api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./CollegStyle.css";
import SocialIcons from "./SocialIcons";
import "./UploadMaterialsStyle.css";
import {  useNavigate } from "react-router-dom";
const UploadMaterials = () => {
  const [formData, setFormData] = useState({
    course_number: "",
    link: "",
    type_of_link: "pdf",
    notes: "",
  });
  const navigate = useNavigate();
  const [googleUser, setGoogleUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!googleUser) {
      setErrorMessage("يرجى تسجيل الدخول باستخدام حساب Google.");
      return;
    }

    const fullData = {
      ...formData,
      type_of_link: formData.type_of_link,
      submitted_by_name: googleUser.name,
      submitted_by_email: googleUser.email,
      google_sub: googleUser.sub,
      status: "draft",
    };

    const success = await uploadMaterial(fullData);
    if (success) {
      setSuccessMessage("تم رفع المادة بنجاح!");
      setFormData({
        course_number: "",
        link: "",
        type_of_link: "pdf",
        notes: "",
      });
    } else {
      setErrorMessage("حدث خطأ أثناء الرفع، يرجى المحاولة مرة أخرى.");
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    setGoogleUser({
      name: decoded.name,
      email: decoded.email,
      sub: decoded.sub,
    });
  };

  const handleGoogleLoginError = () => {
    setErrorMessage("حدث خطأ أثناء تسجيل الدخول باستخدام Google.");
  };
  const handleBack = () => navigate("/");

  return (
    <div>
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
        <button onClick={handleBack} className="back-button">  العودة إلى الكليات  ← </button>
      </nav>

      <header>
        <img
          src="/hebronuniversity.jpg"
          alt="Hebron University"
          className="college-container-img"
        />
      </header>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="rror-hint">{errorMessage}</p>}

      <h1>إضافة مواد دراسية</h1>

      {!googleUser ? (
        <div className="google-login-container">
          <div className="google-login-button-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              shape="pill"
              size="medium"
              width="250"
            />
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "var(--accent-color)",
              marginBottom: "20px",
            }}
          >
            مرحبًا، {googleUser.name} - تم تسجيل الدخول بنجاح!
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="course_number"
              placeholder="رقم المادة (مثال: T15963)"
              value={formData.course_number}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="link"
              placeholder="رابط جوجل درايف أو YouTube"
              value={formData.link}
              onChange={handleChange}
              required
            />
            <select
              name="type_of_link"
              value={formData.type_of_link}
              onChange={handleChange}
              required
            >
              <option value="pdf">PDF</option>
              <option value="youtube">YouTube</option>
              <option value="form">Form</option>
            </select>
            <textarea
              name="notes"
              placeholder="ملاحظات (اختياري)"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>

            <button className="materiale-button" type="submit">
              إضغط لتحميل الملفات
            </button>
          </form>
        </>
      )}

      <footer className="footer">
        <p>© 2025 جميع الحقوق محفوظة - تصميم وتطوير</p>
        <div>
          <SocialIcons />
        </div>
      </footer>
    </div>
  );
};

export default UploadMaterials;