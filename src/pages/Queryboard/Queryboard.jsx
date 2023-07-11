import {
  Background,
  Controls,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./queryboard.css";
import { AiOutlineClose } from "react-icons/ai";

const Queryboard = () => {
  const [bubbleColor, setBubbleColor] = useState("#ffffff");
  const [bubbleSize, setBubbleSize] = useState(92);
  const [backgroundColor, setBackgroundColor] = useState("#e6e6e6");
  const [textSize, setTextSize] = useState(14);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const params = useParams();

  const nodeDefaults = {
    style: {
      fontSize: +textSize,
      borderRadius: "100%",
      backgroundColor: bubbleColor,
      width: 40 + +bubbleSize,
      height: +bubbleSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  function generateUniquePosition(count = 0) {
    let finalPositions = [];
    let x_positions = [];
    let y_positions = [];

    for (let i = 0; i < count; i++) {
      let x_cordinate = generateCordinate(count, x_positions, 20) + 92;
      let y_cordinate = generateCordinate(count, y_positions, 10) + 50;

      x_positions.push(x_cordinate);
      y_positions.push(y_cordinate);

      finalPositions.push({ x: x_cordinate, y: y_cordinate });
    }
    console.log("x_positions", x_positions);

    return finalPositions;
  }

  function generateCordinate(count, corrdinate_array = [], spacing = 0) {
    let x_cordinate = Math.floor(Math.random() * count) * spacing;
    if (corrdinate_array.includes(x_cordinate)) {
      return generateCordinate(count, corrdinate_array, spacing);
    } else {
      // if (condition) {

      // }
      return x_cordinate;
    }
  }

  function createNodes(counts = 0) {
    const nodePositions = [];

    let nodeId = 1;
    let yNodes = 10;

    for (let y = 0; y < yNodes; y++) {
      for (let x = 0; x < yNodes; x++) {
        const position = { x: x * 150, y: y * 100 };
        nodePositions.push(position);
      }
    }
    // for (let y = 0; y < counts; y++) {
    //   for (let x = 0; x < counts / 50; x++) {
    //     const position = { x: x * 100, y: y * 50 };
    //         nodePositions.push(position);
    //   }
    // }

    return nodePositions;
  }

  // Make a GET request to the API
  useEffect(() => {
    axios
      .get("https://dbpedia.org/sparql", {
        params: {
          "default-graph-uri": "http://dbpedia.org",
          query: `SELECT DISTINCT *
          WHERE {
          ?subclass rdfs:subClassOf dbo:${
            params.id.charAt(0).toUpperCase() + params.id.slice(1)
          } .
          OPTIONAL{?subclass rdfs:label ?label_subclass.
          FILTER (lang(?label_subclass) = 'en')}
          }
          LIMIT 100`,
          format: "application/sparql-results+json",
          timeout: 10000,
          signal_void: "on",
          signal_unconnected: "on",
        },
      })
      .then((response) => {
        const apiResponse = response.data;
        const bindings = apiResponse.results.bindings;

        const generatePositions = (
          count,
          startX,
          startY,
          spacingX,
          spacingY
        ) => {
          const positions = [];
          const xPositions = [];

          for (let i = 0; i < count; i++) {
            // const angle = (2 * Math.PI * i) / count;
            // let x, y;
            // if (i % 2 === 0) {
            //   x = centerX + radius * Math.cos(angle + 400);
            //   y = centerY + radius * Math.sin(angle + 400);
            // } else {
            //   x = centerX + radius * Math.cos(angle);
            //   y = centerY + radius * Math.sin(angle);
            // }
            // positions.push({ x, y });
          }

          return positions;
        };

        // Usage:
        const nodeCount = bindings.length;
        const centerX = 500; // X-coordinate of the center of the circle
        const centerY = 300; // Y-coordinate of the center of the circle
        const radius = 300; // Radius of the circle
        // const positions = generatePositions(
        //   nodeCount,
        //   centerX,
        //   centerY,
        //   radius
        // );
        // const positions = generateUniquePosition(nodeCount);
        const positions = createNodes(nodeCount);

        const initialNodes = bindings.map((binding, index) => ({
          id: binding.label_subclass.value,
          data: {
            label: binding.label_subclass.value,
            uri: binding.subclass.value,
          },
          // position: positions[index % positions.length],
          position: positions[index],
          type: "default",
          ...nodeDefaults,
        }));

        const initialEdges = bindings.map((binding, index) => ({
          id: binding.label_subclass.value.split("/").pop(),
          source: params.id,
          target: binding.label_subclass.value,
        }));

        initialNodes.push({
          id: params.id,
          data: { label: params.id },
          position: { x: 500, y: -300 },
          type: "default",
          ...nodeDefaults,
        });

        setNodes(initialNodes);
        setEdges(initialEdges);
      });
  }, []);

  const updatePos = useCallback(() => {
    setNodes((nds) => {
      return nds.map((node) => {
        return {
          ...node,
          position: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          },
        };
      });
    });
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (event, node) => {
    let selectedNodes = {
      totalNode: nodes.length,
      id: node.id,
      size: bubbleSize,
    };

    // Display the popup card
    const popupCard = document.getElementById("popup-card");
    popupCard.style.display = "block";

    // Update the popup card content
    document.getElementById("popup-title").textContent = "Selected Node: " + selectedNodes.id;
    document.getElementById("popup-size").textContent = "Size: " + selectedNodes.size;
    document.getElementById("popup-total-nodes").textContent = "Total Nodes: " + selectedNodes.totalNode;

    // Retrieve the top 5 nodes
    const topNodes = nodes.slice(0, 5);

    // Clear the existing content in the .top-list element
    const topList = document.querySelector(".top-list");
    topList.innerHTML = "";

    // Append the top nodes to the .top-list element
    topNodes.forEach((node) => {
      const nodeItem = document.createElement("li");
      nodeItem.textContent = ` ${node.id}`;
      topList.appendChild(nodeItem);
    });
  };

  const closePopup = () => {
    // Hide the popup card
    const popupCard = document.getElementById("popup-card");
    popupCard.style.display = "none";
  };

  useEffect(() => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) => ({
        ...node,
        ...nodeDefaults,
      }));
      return updatedNodes;
    });

    setEdges((prevEdges) => {
      const updatedEdges = prevEdges.map((edge) => ({
        ...edge,
      }));
      return updatedEdges;
    });
  }, [nodes, edges]);

  return (
    <div className="right-container">
      <div className="controls-container">
        <h2>All Controls </h2>

        <div className="input-box-container">
          <div className="input-box">
            <label>Select the color of Bubble</label>
            <input
              type="color"
              value={bubbleColor}
              onChange={(e) => setBubbleColor(e.target.value)}
            />
          </div>
          <div className="input-box">
            <div className="range-box">
              <label>Change size of bubble</label>
              <input
                type="text"
                className="range-input"
                value={bubbleSize}
                onChange={(e) => setBubbleSize(e.target.value)}
                id="range-input"
                maxLength="5"
              />
            </div>
            <input
              type="range"
              className="range-slider"
              value={bubbleSize}
              onChange={(e) => setBubbleSize(e.target.value)}
              minLength="4"
              maxLength="20"
              step="0.2"
              id="range-slider"
            />
          </div>
          <div className="input-box">
            <label htmlFor="colorInput">Select the color of Background</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
        </div>
        <div className="input-box-container">
          <div className="input-box">
            <div className="range-box">
              <label>Change size of Text</label>
              <input
                type="text"
                className="range-input"
                value={textSize}
                onChange={(e) => setTextSize(e.target.value)}
                id="range-input"
                maxLength="5"
              />
            </div>
            <input
              type="range"
              className="range-slider"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
              minLength="4"
              maxLength="20"
              step="0.2"
              id="range-slider"
            />
          </div>
        </div>
      </div>
      {/* <button onClick={updatePos}>Update POS</button> */}

      <div
        className="diagram"
        style={{
          height: "500px",
          width: "80%",
          border: "1px solid black",
          padding: "20px",
          background: backgroundColor,
        }}
      >
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {/* <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow nodes={initialNodes} edges={initialEdges} />
      </div> */}
      <div id="popup-card" className="popup-card">
        <span className="close-button" onClick={closePopup}>
          <AiOutlineClose />
        </span>
        <div className="left-list">
          <h2 id="popup-title">TEST</h2>
          <p id="popup-size"></p>
          <p id="popup-total-nodes"></p>
        </div>
        <div className="top-list"></div>
      </div>
    </div>
  );
};

export default Queryboard;
