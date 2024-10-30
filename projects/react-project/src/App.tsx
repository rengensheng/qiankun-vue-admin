import { useState } from 'react'
import './App.css'
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className='px-2 py-1 font-bold'>
        <div>React 子应用</div>
        <div>{count}</div>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
    </>
  )
}

export default App
