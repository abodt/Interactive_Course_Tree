import axios from "axios";

const COURSE_API_URL = "http://localhost:8055/items/Course_table";
const EDGE_API_URL = "http://localhost:8055/items/Course_unlock_table";
const Planyear_API_URL = "http://localhost:8055/items/Plan_Year_Course";





const groupWidth = 700;
const groupHeight = 2400;
const groupXSpacing = 800;
const groupYPosition = 50;

const nodeWidth = 120;
const nodeHeight = 60;
const nodeHorizontalSpacing = 250;
const nodeVerticalSpacing = 150;
const nodesPerRow = 2;

export const fetchGraphData = async (Plan_year_id) => {
  try {
    const planYearResponse = await axios.get(Planyear_API_URL, {
      params: { filter: { Plan_year_id: { _eq: Plan_year_id } } },
    });

    const planYearCourses = planYearResponse?.data?.data || [];

    if (planYearCourses.length === 0) {
      return { nodes: [], edges: [] };
    }

    const courseIds = planYearCourses.map(course => course.Course_ID);

    const courseResponse = await axios.get(COURSE_API_URL, {
      params: { filter: { id: { _in: courseIds } } },
    });

    const courses = courseResponse?.data?.data || [];

    const edgeResponse = await axios.get(EDGE_API_URL);
    const allEdges = edgeResponse?.data?.data || [];
    const courseEdges = allEdges

    // const courseEdges = allEdges.filter(
    //   edge =>
    //     edge.Course_id &&
    //     edge.Unlock_coruse_id 
    //     //&&
    //     // courseIds.includes(edge.Course_id) &&
    //     // courseIds.includes(edge.Unlock_coruse_id)
    // );

    const nodeShapeMap = new Map();
    allEdges.forEach(edge => {
      if (edge.Course_id && edge.Node_shape) {
        nodeShapeMap.set(edge.Course_id, edge.Node_shape);//Only if I have both the course's ID and its shape, store them in my shape map
      }
    });

    // const years = [...new Set(courses.map(course => course.YaerOfCourse))].sort();
    // const years = [...new Set(courses.map(course => course.YaerOfCourse))].sort();
    const years = [1, 2, 3, 4]

 

    const groupNodes = years.map((year, index) => ({
      id: `group-Y${year}`,
      data: { label: `السنة ${year}` },
      position: { x: groupXSpacing * index, y: groupYPosition },
      style: {
        width: groupWidth,
        height: groupHeight,
        border: "2px dashed #ccc",
        background: "rgba(200, 200, 255, 0.2)",
      },
      selectable: false,
      draggable: false,
    }));

    const courseNodes = courses.map((course) => {
      const parentGroupId = `group-Y${course.YaerOfCourse}`;
      const yearCourses = courses.filter(c => c.YaerOfCourse === course.YaerOfCourse);
      const positionIndex = yearCourses.findIndex(c => c.id === course.id);// we find the index of the course id 
      const col = positionIndex % nodesPerRow;// for example 30%2 is 0 so the first col
      const row = Math.floor(positionIndex / nodesPerRow);// for examlple 30/2 15 so 15 row 

      const nodeX = 100 + col * (nodeWidth + nodeHorizontalSpacing);//spacing 
      const nodeY = 50 + row * (nodeHeight + nodeVerticalSpacing);

      let borderStyle = "1px solid #333";
      const shape = nodeShapeMap.get(course.id);
      if (shape === 1) borderStyle = "6px solid #333";
      else if (shape === 3) borderStyle = "4px dashed #333";

      return {
        id: `course-${course.id}`,
        parentNode: parentGroupId,
        extent: "parent",
        data: { label: course.Name },
        position: { x: nodeX, y: nodeY },
        sourcePosition: "right",
        targetPosition: "left",
        style: {
          width: nodeWidth,
          height: nodeHeight,
          border: borderStyle,
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 12,
          color: "#000",
        },
      };
    });

    const uniqueEdges = new Map();
    courseEdges.forEach((edge) => {
      const key = `edge-${edge.Course_id}-${edge.Unlock_coruse_id}`;
      if (!uniqueEdges.has(key)) {
        uniqueEdges.set(key, {
          id: key,
          source: `course-${edge.Course_id}`,
          target: `course-${edge.Unlock_coruse_id}`,
          type: "animated",
          style: { stroke: "#007bff", strokeWidth: 2 },
        });
      }
    });

    return {
      nodes: [...groupNodes, ...courseNodes],
        edges: Array.from(uniqueEdges.values()),//turning onjects back to normak arry 
    };
  } catch (error) {
    console.error("حدث خطأ أثناء جلب البيانات:", error);
    return { nodes: [], edges: [] };
  }
};