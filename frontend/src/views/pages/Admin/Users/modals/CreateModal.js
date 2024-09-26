import { useEffect, useState } from 'react'
import { Button, Modal} from 'react-bootstrap'
import { InputText, InputTextarea, appendFormData } from '../../../../../libs/FormInput'
import axios from '../../../../../libs/axios'
import useStore from '../../../../../store';
//import HtmlForm from '../components/HtmlForm'

export default function CreateModal() {
    const store = useStore()
    const url = process.env.REACT_APP_API_URL + '/admin/roles'; // get available roles

    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        console.log('init for CreateModal')

    },[])

    const handleShowClick = () =>{
      //store.emptyData() // empty store data
      setShow(true)
      
      // load roles
      axios({ 
          method: 'get', 
          url: `${url}`,
          })
      .then( response => { // success 200
          //console.log(response)
          store.setValue('roles', response.data.roles)
          })
      .catch( error => {
          console.warn(error)
      })
      
    } 

    const handleCloseClick = () => {
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
        
        //const formData = new FormData() // data container
       
        // if (store.getValue('name') != null ) {  // get role name entered by user
        //     formData.append('name', store.getValue('name')); // append to formData
        // }

        // if (store.getValue('email') != null ) {  // get role name entered by user
        //   formData.append('email', store.getValue('email')); // append to formData
        // }

        const formData = new FormData();
        const dataArray = [
            { key: 'name', value: store.getValue('name') },
            { key: 'role_id', value: store.getValue('role_id') },
            { key: 'email', value: store.getValue('email') },
            { key: 'password', value: store.getValue('password') },
            { key: 'password_confirmation', value: store.getValue('password_confirmation') },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/users`,
            data: formData
          })
          .then( response => { // success 200
            console.log(response)
            store.setValue('refresh', true) // to force useEffect get new data for index
            setIsLoading(false) // animation
            handleClose() // close the modal
          })
          .catch( error => {
            console.warn(error)
            
            if( error.response?.status == 422 ){ // detect 422 errors by Laravel
              console.log(error.response.data.errors)
              store.setValue('errors', error.response.data.errors ) // set the errors to store
            }
            setIsLoading(false) // animation
          })
    }
  
    return (
      <>
        <Button variant="primary" onClick={handleShowClick}>
          Create
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create User</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* <HtmlForm isLoading={isLoading} /> */}
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              Close
            </Button>

            <Button 
              disabled={isLoading}
              variant="primary" 
              onClick={handleSubmitClick}>
              Submit
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }