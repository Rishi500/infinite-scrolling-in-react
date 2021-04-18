import logo from './logo.svg';
import './App.css';
import useBookSearch from './useBookSearch'
import {useState,useRef,useCallback} from 'react'
function App() {
  const [query,setQuery] = useState('')
  const [page,setPage] = useState(1)
  const {books,loading,error,hasMore} = useBookSearch(query,page)
  function handleChange(query){
    setQuery(query)
    setPage(1)
    
  }
  const observer = useRef()
  const lastBookElementRef = useCallback(node=>{
    if(loading)return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting && hasMore){
          setPage(prevPage=> prevPage+1)
          console.log('visible')
        }
    })
    if(node) observer.current.observe(node)
    console.log(node)
  },[loading,hasMore])
  return (
    <>
    <h1>This is an example of infinite scrolling</h1>
    <input type="text" value={query} onChange={(e)=>{handleChange(e.target.value)}}></input>
    {books.map((b,index)=>{
      if(index+1==books.length){
        return (<p ref={lastBookElementRef} key={b}>{b}</p>)
      }
      return (<p key={b}>{b}</p>)
    })}
    <h3>{loading && 'Loading...'}</h3>
    <h3>{error && 'An error has occured..'}</h3>
    </>
  );
}

export default App;
