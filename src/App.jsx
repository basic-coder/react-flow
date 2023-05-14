
import logo from './logo.svg';
import './App.css';
import { Background, Controls, ReactFlow, applyEdgeChanges, applyNodeChanges, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState } from 'react';
import {BsSun,BsMoon} from 'react-icons/bs'

function App() {

  const [bubbleColor, setBubbleColor] = useState("#ffffff")
  const [bubbleSize, setBubbleSize] = useState(70)
  const [backgroundColor, setBackgroundColor] = useState('#e6e6e6')
  const [textSize, setTextSize] = useState(11)
  const [theme, setTheme] = useState(false)
  

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

  const themeToggler = () =>{
    setTheme(!theme)
    document.body.classList.toggle("active");
  }

  const initialNodes = [
    { id: 'WASHINGTON', data: { label: 'LaJOCONDE A WASHINGTON' }, position: { x: 200, y: 0 }, type: 'default',  ...nodeDefaults},
    { id: 'MONA', data: { label: 'MONA LISA' }, position: { x: 400, y: 200 }, type: 'default', ...nodeDefaults },
    { id: 'VINCI', data: { label: 'DA VINCI' }, position: { x: 100, y: 200 }, type: 'default', ...nodeDefaults },
    { id: 'LILY', data: { label: 'LILY' }, position: { x: 100, y: 600 }, type: 'default', ...nodeDefaults },
    { id: 'LOUVRE', data: { label: 'LOUVRE' }, position: { x: 600, y: 200 }, type: 'default', ...nodeDefaults },
    { id: 'Museum', data: { label: 'Museum' }, position: { x: 500, y: 50 }, type: 'default', ...nodeDefaults },
    { id: 'Person', data: { label: 'Person' }, position: { x: 200, y: 450 }, type: 'default', ...nodeDefaults },
    { id: 'James', data: { label: 'James' }, position: { x: 400, y: 600 }, type: 'default', ...nodeDefaults },
    { id: '1984', data: { label: 'Jan 1 1984' }, position: { x: 700, y: 600 }, type: 'default', ...nodeDefaults },
    { id: 'Paris', data: { label: 'Paris' }, position: { x: 900, y: 200 }, type: 'default', ...nodeDefaults },
    { id: 'Place', data: { label: 'Place' }, position: { x: 600, y: 400 }, type: 'default', ...nodeDefaults },
    { id: 'Eiffel', data: { label: 'Tour Eiffel' }, position: { x: 900, y: 400 }, type: 'default', ...nodeDefaults },
  ];

  const initialEdges = [
    { id: 'subclass1', label: 'is interested in', source: 'LILY', target: 'VINCI', data: { label: 'is interested in' }, },
    { id: 'subclass2', label: 'is a', source: 'LILY', target: 'Person', data: { label: 'is a' } },
    { id: 'subclass3', label: 'is a friend of', source: 'LILY', target: 'James', data: { label: 'is a friend of' } },
    { id: 'subclass4', label: 'is a', source: 'VINCI', target: 'Person', data: { label: 'is a' } },
    { id: 'subclass5', label: 'painted', source: 'VINCI', target: 'MONA', data: { label: 'painted' } },
    { id: 'subclass6', label: 'is about', source: 'WASHINGTON', target: 'MONA', data: { label: 'is about' } },
    { id: 'subclass7', label: 'is in', source: 'MONA', target: 'LOUVRE', data: { label: 'is in' } },
    { id: 'subclass8', label: 'is a', source: 'LOUVRE', target: 'Museum', data: { label: 'is a' } },
    { id: 'subclass9', label: 'is located in', source: 'LOUVRE', target: 'Paris', data: { label: 'is located in' } },
    { id: 'subclass10', label: 'is a', source: 'Paris', target: 'Place', data: { label: 'is a' } },
    { id: 'subclass11', label: 'is located in', source: 'Eiffel', target: 'Paris', data: { label: 'is located in' } },
    { id: 'subclass12', label: 'is a', source: 'James', target: 'Person', data: { label: 'is a' } },
    { id: 'subclass13', label: 'likes', source: 'James', target: 'MONA', data: { label: 'likes' } },
    { id: 'subclass14', label: 'has visited', source: 'James', target: 'LOUVRE', data: { label: 'has visited' } },
    { id: 'subclass15', label: 'has lived in', source: 'James', target: 'Eiffel', data: { label: 'has lived in' } },
    { id: 'subclass16', label: 'is born on', source: 'James', target: '1984', data: { label: 'is born on' } },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // const edgeTypes = {
  //   default: { 
  //     type: 'arrow',
  //     stroke: '#999',
  //     strokeWidth: 2,
  //     labelStyle: { fill: '#333', fontSize: 10 },
  //   },
  // };


  useEffect(()=>{
    setNodes(initialNodes)
  },[nodes])

  return (
    <div className='main-container'>
      <div className='left-container'>
        <div className="logo">
          Flow
        </div>

        <ul className='nav-list'>
          <li className="nav-item">
            Flow Chart 
          </li>
        </ul>
      </div>
      <div className='right-container'>
        <div className='controls-container'>
          <h2>All Controls <span onClick={themeToggler}> { theme ? <BsMoon /> : <BsSun /> }</span></h2>

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
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default App