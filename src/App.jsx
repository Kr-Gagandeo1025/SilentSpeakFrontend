import {Routes,Route} from 'react-router-dom'
import Home from './component/Home';
import Room from './component/Room';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/room/:id" element={<Room/>}/>
        </Routes>
    </div>
  );
}

export default App;
