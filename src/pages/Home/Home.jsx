import { Background, Controls, ReactFlow, applyEdgeChanges, applyNodeChanges, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState } from 'react';
import './home.css'
import axios from 'axios';
import { BsMoon, BsSun } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const Home = () => {
  
    const [classes, setClasses] = useState({})
    const [theme, setTheme] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const themeToggler = () =>{
        setTheme(!theme)
        document.body.classList.toggle("active");
      }

  // Make a GET request to the API
  useEffect(() => {
    // Make a GET request to the API
    setLoading(true)
    axios
      .get('https://dbpedia.org/sparql', {
        params: {
          'default-graph-uri': 'http://dbpedia.org',
          query: `select distinct ?Concept ?label where {
            {[] a ?Concept}
            Union {?Concept a owl:Class}
            Union {?Concept a rdfs:Class}
            ?Concept rdfs:label ?label
            filter (lang(?label)="en")
          }
          LIMIT 1000`,
          format: 'application/sparql-results+json',
          timeout: 10000,
          signal_void: 'on',
          signal_unconnected: 'on',
        },
      })
      .then((response) => {
        const apiResponse = response.data.results.bindings;
        setClasses(apiResponse)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const submitHandler = (e) =>{
    e.preventDefault(); 
    const selectedOption = e.target.elements.selectClass.value;
    navigate("/query/"+selectedOption);
  }

  if(loading) return <Loader />
  return (
    <div className='right-container'>
        <form onSubmit={submitHandler} className='queryForm'>
            <h3>Query form</h3>
            <div className="inputBox">
                <label>Select Class</label>
                <select name="selectClass">
                    {
                        Object.keys(classes).length > 0 ? ( classes.map((elem) => <option value={elem.label.value}> {elem.label.value} </option>)) :
                        ( <option value="">No classes available</option> )
                    }
                </select>
            </div>
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default Home