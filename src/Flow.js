import React, { useEffect, useState } from "react";
import AnimatedEdge from "./AnimatedEdge";
import ReactFlow, { ReactFlowProvider, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGraphData } from "./initialElements";
import axios from "axios";
import "./FlowStyle.css";

const edgeTypes = { animated: AnimatedEdge };
const PLAN_YEAR_API_URL = "http://localhost:8055/items/Plan_year_Table";

const Flow = () => {
  const { majorId, plan_year_id } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showAllEdges, setShowAllEdges] = useState(false);
  const [planYears, setPlanYears] = useState([]);
  const [selectedPlanYear, setSelectedPlanYear] = useState(plan_year_id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMovingBall, setShowMovingBall] = useState(true);

  const { fitView } = useReactFlow();//hook to give u accese to  fitview
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanYears = async () => {
      try {
        const response = await axios.get(PLAN_YEAR_API_URL, {
          params: { filter: { Major_id: { _eq: majorId } } },
        });
      
        const data = response.data.data;
        setPlanYears(data);
        if (data.length > 0 && !plan_year_id) {
          setSelectedPlanYear(data[0].id);
          navigate(`/majors/${majorId}/courses/${data[0].id}`);
        }
      } catch (error) {
        setError("Error fetching plan years");
        console.error("Error fetching plan years:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanYears();
  }, [majorId, plan_year_id, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPlanYear) return;
      setLoading(true);

      try {
        const { nodes, edges } = await fetchGraphData(selectedPlanYear);

        const styledNodes = nodes.map((node) => ({
          ...node,
          className: "custom-node",
        }));

        const styledEdges = edges.map((edge) => ({
          ...edge,
          hidden: !showAllEdges,
          data: { showMovingBall },
        }));

        setNodes(styledNodes);
        setEdges(styledEdges);
      } catch (error) {
        setError("Error fetching graph data");
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPlanYear, showAllEdges, showMovingBall]);

  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    }
  }, [nodes, fitView]);

  const handlePlanYearChange = (event) => {
    const newPlanYear = event.target.value;
    setSelectedPlanYear(newPlanYear);
    navigate(`/majors/${majorId}/courses/${newPlanYear}`);
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setShowAllEdges(isChecked);
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({ ...edge, hidden: !isChecked }))
    );
  };

  const handleBallCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setShowMovingBall(isChecked);
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({
        ...edge,
        data: { showMovingBall: isChecked },
      }))
    );
  };

  const handleNodeDoubleClick = (event, node) => {
    navigate(`/course/${node.id.replace("course-", "")}`);
  };
  

  // Handle node click to show only the related edges
  const handleNodeClick = (event, node) => {
    if (!showAllEdges) {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => ({
          ...edge,
          hidden: !(edge.source === node.id || edge.target === node.id),
        }))
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p className="loading-text">{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "white",
          padding: "5px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <label className="plan-label-inline">
          <select value={selectedPlanYear} onChange={handlePlanYearChange}>
            {planYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.Plan_Year_Number}
              </option>
            ))}
          </select>
          <span>قم باختيار سنة الخطة الدراسية</span>
        </label>

        <label className="checkbox-label-inline">
          <input
            type="checkbox"
            checked={showAllEdges}
            onChange={handleCheckboxChange}
          />
          <span>إظهار جميع روابط المساقات</span>
        </label>

        <label className="checkbox-label-inline">
          <input
            type="checkbox"
            checked={showMovingBall}
            onChange={handleBallCheckboxChange}
          />
          <span>تشغيل/إيقاف حركة الكرة</span>
        </label>
          {/* وصف أنواع الحدود */}
  <div style={{ marginTop: "15px", fontSize: "13px", color: "#555" }}>
    <strong>دليل نوع المساقات:</strong>
    <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
      <li><span style={{ fontWeight: "bold" }}>حد أسود عريض</span>: متطلب كلية إجباري</li>
      <li><span style={{ fontWeight: "bold" }}>حد أسود عادي</span>: تخصص إجباري</li>
      <li><span style={{ fontWeight: "bold" }}>حد أسود متقطع</span>: تخصص اختياري</li>
    </ul>
  </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick} // Handle node clicks
        onNodeDoubleClick={handleNodeDoubleClick}

        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
};

const FlowWithProvider = () => (
  //return with war[ing]
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default FlowWithProvider;
