import './App.css'
import { useCustomFetch } from './hooks/useCustomFetch';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const {data, isPending, isError} = useCustomFetch<User>(
    'https://jsonplaceholder.typicode.com/users/1'
  );

  if(isPending){
    return <div>Loading..</div>
  }
  return (
    <>
      <h1>Tanstack Qucery</h1>
      {data?.name}
    </>
  )
}

export default App
