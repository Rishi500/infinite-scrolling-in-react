import {useEffect,useState} from 'react'
import axios from 'axios'
export default function useBookSearch(query,page){
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [books,setBooks] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const url = 'http://openlibrary.org/search.json'
    let cancel
    useEffect(()=>{
        setBooks([])
    },[query])
    useEffect(()=>{
        setLoading(true)
        axios({
            method:'GET',
            url:url,
            params:{
                q:query,
                page:page
            },
            cancelToken: new axios.CancelToken(c=>cancel=c)
        })
        .then(
            res=>{console.log(res.data)
            setBooks(prevBooks=>{
                return [...new Set([...prevBooks,...res.data.docs.map(b=>b.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
            })
        .catch(e=>{
            console.log('cancled')
            if(axios.isCancel(e))return 
            setError(true)
         })
        return ()=>cancel()

    },[query,page])
    return {books,loading,error,hasMore}

}