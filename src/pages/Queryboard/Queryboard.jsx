import { Background, Controls, ReactFlow, applyEdgeChanges, applyNodeChanges} from 'reactflow';
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './queryboard.css'
import {AiOutlineClose} from 'react-icons/ai'

const Queryboard = () => {
    const [bubbleColor, setBubbleColor] = useState("#ffffff")
    const [bubbleSize, setBubbleSize] = useState(92)
    const [backgroundColor, setBackgroundColor] = useState('#e6e6e6')
    const [textSize, setTextSize] = useState(14)
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const params = useParams()

    const nodeDefaults = {
      style: {
        fontSize: +textSize,
        borderRadius: '100%',
        backgroundColor: bubbleColor,
        width: 40 + +bubbleSize,
        height: +bubbleSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    }; 
  
  // Make a GET request to the API
  useEffect(() => {

      axios
      .get('https://dbpedia.org/sparql', {
        params: {
          'default-graph-uri': 'http://dbpedia.org',
          query: `SELECT DISTINCT *
          WHERE {
          ?subclass rdfs:subClassOf dbo:${params.id.charAt(0).toUpperCase() + params.id.slice(1)} .
          OPTIONAL{?subclass rdfs:label ?label_subclass.
          FILTER (lang(?label_subclass) = 'en')}
          }
          LIMIT 100`,
          format: 'application/sparql-results+json',
          timeout: 10000,
          signal_void: 'on',
          signal_unconnected: 'on'
        }
      })
      .then(response => {
          const apiResponse = response.data;
         const bindings = apiResponse.results.bindings;

        const generatePositions = (count, startX, startY, spacingX, spacingY) => {
          const positions = [];
        
          for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * i) / count;
            let x,y;
            if(i%2===0){
               x = centerX + radius * Math.cos(angle + 400);
             y = centerY + radius * Math.sin(angle + 400);
            }else{
               x = centerX + radius * Math.cos(angle);
               y = centerY + radius * Math.sin(angle);
            }
            
            positions.push({ x, y });
          }
        
        
          return positions;
        };
        
        // Usage:
        const nodeCount = bindings.length;
        const centerX = 500; // X-coordinate of the center of the circle
        const centerY = 300; // Y-coordinate of the center of the circle
        const radius = 300; // Radius of the circle
        const positions = generatePositions(nodeCount, centerX, centerY, radius);
        
  
        const initialNodes = bindings.map((binding, index) => ({
          id: binding.label_subclass.value,
          data: {
            label: binding.label_subclass.value,
            uri: binding.subclass.value
          },
          position: positions[index % positions.length],
          type: 'default',
          ...nodeDefaults
        }));
        const initialEdges = bindings.map((binding, index) => ({
          id: binding.label_subclass.value.split('/').pop(),
          source: params.id,
          target: binding.label_subclass.value
        }));
       initialNodes.push({id:params.id,data:{label:params.id},position:{x:500,y:300},type:'default',...nodeDefaults});

       
        setNodes(initialNodes)
        setEdges(initialEdges)
      })
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
        totalNode : nodes.length,
        id: node.id,
        size: bubbleSize,
      }

        // Display the popup card
        const popupCard = document.getElementById("popup-card");
        popupCard.style.display = "block";

        // Update the popup card content
        document.getElementById("popup-title").textContent = "Selected Node: " + selectedNodes.id;
        document.getElementById("popup-size").textContent = "Size: " + selectedNodes.size;
        document.getElementById("popup-total-nodes").textContent = "Total Nodes: " + selectedNodes.totalNode;

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
          ...nodeDefaults
        }));
        return updatedNodes;
      });
      setEdges((prevEdges) => {
        const updatedEdges = prevEdges.map((edge) => ({
          ...edge,
        }));
        return updatedEdges;
      });
    }, [nodes,edges]);

  return (
    <div className='right-container'>
        <div className='controls-container'>
          <h2>All Controls </h2>

          <div className='input-box-container'>
            <div className='input-box'>
              <label>Select the color of Bubble</label>
              <input type="color" value={bubbleColor} onChange={(e)=>setBubbleColor(e.target.value)} />
            </div>
            <div className='input-box'>
              <div className="range-box">
                <label>Change size of bubble</label>
                <input type="text" className="range-input" value={bubbleSize} onChange={(e)=>setBubbleSize(e.target.value)}  id="range-input" maxLength="5" />
              </div>
              <input type="range" className="range-slider" value={bubbleSize} onChange={(e)=>setBubbleSize(e.target.value)} minLength="4" maxLength="20" step="0.2"  id="range-slider" />
            </div>
            <div className='input-box'>
              <label  htmlFor="colorInput">Select the color of Background</label>
              <input type="color" value={backgroundColor} onChange={(e)=>setBackgroundColor(e.target.value)} />
            </div>
          </div>
          <div className='input-box-container'>
            <div className='input-box'>
              <div className="range-box">
                <label>Change size of Text</label>
                <input type="text" className="range-input" value={textSize} onChange={(e)=>setTextSize(e.target.value)}  id="range-input" maxLength="5" />
              </div>
              <input type="range" className="range-slider" value={textSize} onChange={(e)=>setTextSize(e.target.value)} minLength="4" maxLength="20" step="0.2"  id="range-slider" />
            </div>
          </div>
        </div>

        <div className='diagram' style={{ height: '500px', width: "80%", border: "1px solid black", padding: "20px" , background: backgroundColor }}>
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

          <div id="popup-card" className="popup-card">
            <span className="close-button" onClick={closePopup}><AiOutlineClose /></span>
            <h2 id="popup-title">TEST</h2>
            <p id="popup-size"></p>
            <p id="popup-total-nodes"></p>
          </div>

      </div>
  )
}

export default Queryboard