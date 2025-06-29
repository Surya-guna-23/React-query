import { Link, Outlet,useNavigate,useParams } from 'react-router-dom';
import {useQuery,useMutation} from "@tanstack/react-query"
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import Header from '../Header.jsx';
import ErrorBlock from "../UI/ErrorBlock.jsx"
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const[isdeleting,setisdeleting] =useState(false)
 const params=useParams()
 const navigate = useNavigate()
const {data,isPending,isError,error}=useQuery({
  queryKey:["events",params.id],
  queryFn:({signal})=>fetchEvent({signal,id:params.id})
})
const{mutate,isPending:deletepending,isError:deleterror,error:deleteerrordate}=useMutation({
  mutationFn:deleteEvent,
  onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:["events"],refetchType:"none"})
    navigate("/events")
  }
})
function handledeletestart()
{
setisdeleting(true)
}
function handledeletestop()
{
setisdeleting(false)
}
function handledelete()
{
  mutate({id:params.id})
}
let content
if(isPending)
{
  content= <div id='event-details-content' className='center'>
    <p>Fetching event data....</p>
  </div>
}
if(isError)
{
  content= <div id='event-details-content' className='center'>
    <ErrorBlock title="Failed to load event" message={error.info?.message||"Failed to fecth the event details"}/>
  </div>
}
if(data)
{
  const formattedate = new Date(data.date).toLocaleDateString("en-US",{
    day:"numeric",
    month:"short",
    year:"numeric",
    })
  content= ( 
  <>
  <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handledeletestart}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
  <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedate}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
  </>)
}

  return (
    <>
    {isdeleting && (<Modal onClose={handledeletestop}>
      <h2>Are you sure ?</h2>
      <p>Do you really want to delete this event ? the action cannot be undone</p>
      <div className='form-actions'>
        {deletepending && <p>Deleting please wait ...</p>}
        {!deletepending && 
        <>
        <button onClick={handledeletestop} className='button-text'>Cancel</button>
        <button onClick={handledelete} className='button-text'>Delete</button>
        </>
        }
        
      </div>
      {deleterror&&<ErrorBlock title="Failed to delete" message={deleteerrordate.info?.message||"failed to delet the event"}/>}
    </Modal>)}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}      
      </article>
    </>
  );
}
