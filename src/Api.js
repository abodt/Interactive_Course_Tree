import axios from "axios";

const directus = axios.create({
  baseURL: "/items", // Using proxy from package.json
});

export const uploadMaterial = async (formData) => {
  try {
    // Send data to 'course_details' table
    await directus.post("/course_details", formData); // Updated to match the table name
    return true;
  } catch (error) {
    console.error("Error uploading material:", error);
    return false;
  }
};


// College API functions
export const getColleges = async () => {
  try {
    const response = await directus.get("/College_table");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return [];
  }
};

// Department API functions
export const getCollegeById = async (collegeId) => {
  try {
    const response = await directus.get(`/College_table/${collegeId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching college:", error);
    return null;
  }
};

export const getDepartmentsByCollege = async (collegeId) => {
  try {
    const response = await directus.get("/department_table", {
      params: {
        filter: {
          College_id: { _eq: collegeId },
        },
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

// Fetch majors by department
export const getMajorsByDepartment = async (departmentId) => {
  try {
    const response = await directus.get("/Major_table", {
      params: {
        filter: {
          Department_id: { _eq: departmentId },
        },
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching majors:", error);
    return [];
  }
};

// Fetch plan_year_id from Plan_year_Table based on major ID
export const getPlanYearsByMajor = async (majorId) => {
  try {
    const response = await directus.get("/Plan_year_Table", {
      params: { filter: { Major_id: { _eq: majorId } } },
    });

    // console.log("API Response for plan_year_id:", response.data);

    return response.data.data.length > 0 ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching plan years for major:", error);
    return [];
  }
};

// Fetch course details by course ID
export const getCourseById = async (courseId) => {
  try {
    const response = await directus.get(`/Course_table/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
};

// Fetch links related to a course ID
export const getLinksByCourseId = async (courseId) => {
  try {
    const response = await directus.get("/course_details", {
      params: {
        filter: {
          course_id: { _eq: courseId },
        },
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course links:", error);
    return [];
  }
};
