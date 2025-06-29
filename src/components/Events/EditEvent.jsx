import { Link, useNavigate,useParams } from 'react-router-dom';
import { useQuery,useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {  
  const params = useParams();
  const navigate = useNavigate();
 const{data, isPending, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
  const { mutate} = useMutation({
    mutationFn: updateEvent,

    onMutate:async (data)=>{
      const newdata =data.event
      
      const previousdata = queryClient.getQueryData(['events', params.id])
      await queryClient.cancelQueries({queryKey:["events",params.id]})
      queryClient.setQueryData(['events', params.id],newdata)
      return{previousdata}
    },
    onError:(data,error,context)=>{
      queryClient.setQueryData(["events",params.id],context.previousdata)

    },
    onSettled:()=>{
      queryClient.invalidateQueries(["events",params.id])
    }
  });
  let content;
  if(isPending) {
    content =<>
    <div  className='center'>
        <LoadingIndicator />
      </div>
  </>    
  }
  if(isError){
    content = <>
    <ErrorBlock title="Failed to load event" message={error.info?.message || "Failed to fetch the event details"} />
    <div className='form-actions'>
      <Link to="../" className="button">
      Okay</Link>
      </div>
    </>
  }
  if(data){
    content = (
     <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }
  function handleSubmit(formData) {
    mutate({
      id: params.id,
      event: formData,
    });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
