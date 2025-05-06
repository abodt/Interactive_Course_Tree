import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import College from "./College";
import Department from "./Department";
import Majors from "./Majors";
import Flow from "./Flow";
import CourseDetails from "./CourseDetails";
import UploadMaterials from "./UploadMaterials";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<College />} />
        <Route></Route>
        <Route path="/departments/:collegeId" element={<Department />} />
        <Route path="/majors/:departmentId" element={<Majors />} />
        <Route
          path="/majors/:majorId/courses/:plan_year_id"
          element={<Flow />}
        />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/upload-materials" element={<UploadMaterials />} />
        
        {/* <Route path="*" component={NoMatch} status={404} /> */}
      </Routes>
    </Router>
  );
}

export default App;
