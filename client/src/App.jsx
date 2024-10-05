import './App.css';
import {useState, useEffect} from 'react';
import {getARandomPark} from "./functions/getARandomPark";

function App() {
    const [data, setData] = useState("TrailMix: fetching data...");

    useEffect(() => {
        getARandomPark().then(res => {
            console.log(res[0])
            setData(res[0].name + " National Park, " + res[0].state);
        }).catch(err => console.log(err));
    }, []);

    return (
        <div className="App">
            <h1>{data}</h1>
        </div>
    );
}

export default App;