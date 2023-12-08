"use client"
// import { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { useRouter } from 'next/navigation';
// import { gql } from '@apollo/client';
// import { ApolloProvider } from '@apollo/client';
// import apolloClient from '../../../../apollo-client';
// import axios from 'axios';

// const GET_CLIENTS = gql`
//   query getClients {
//     clients {
//       id
//       name
//       email
//       phone
//     }
//   }
// `;

// const GamesPage = () => {
//   const { loading, error, data } = useQuery(GET_CLIENTS, { client: apolloClient });
//   const router = useRouter();

//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Something went wrong</p>

//   const containerStyle = {
//     fontFamily: 'Arial, sans-serif',
//     padding: '20px',
//     backgroundColor: '#f4f4f4',
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     gridGap: '20px',
//   };

//   const gameStyle = {
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     padding: '10px',
//     backgroundColor: '#fff',
//   };

//   const titleStyle = {
//     fontSize: '1.5em',
//     fontWeight: 'bold',
//     marginBottom: '5px',
//   };

//   const platformStyle = {
//     color: '#555',
//   };

//   const logout = async () => {
//     try {
//       await axios.get('/api/users/logout');
//       router.push('/login');
//     } catch (error) {
//       console.log("message");
//     }
//   };

// //   const handleDelete = (gameId: any) => {
// //     const updatedGames = games.filter((game: any) => game.id !== gameId);
// //     setGames(updatedGames);
// //   };

//   return (
//     <ApolloProvider client={apolloClient}>

//       { !loading && !error && (
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//           </tr>
//         </thead>
//         <tbody>
//          <tr>
//            <td>{ client.name}</td>
//            <td>{ client.email}</td>
//            <td>{ client.phone}</td>
//          </tr>
//         </tbody>
//       </table>
//       )}


//       <button
//         onClick={logout}
//         style={{
//           backgroundColor: '#4285f4',
//           color: 'white',
//           fontWeight: 'bold',
//           padding: '10px 20px',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//           marginTop: '20px',
//         }}
//       >
//         Logout
//       </button>
//     </ApolloProvider>
//   );
// };

//  export default GamesPage;

import { useQuery } from '@apollo/client';
import { gql, useMutation } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../../../../apollo-client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaTrash, FaUser } from 'react-icons/fa'
import { GET_CLIENTS } from '../../queries/clients'
import { DELETE_CLIENT, ADD_CLIENT } from '../../mutations/clientMutation'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { cache } from '@babel/traverse';



const GamesPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_CLIENTS, { client: apolloClient });
  const [deleteClient] = useMutation(DELETE_CLIENT, { client: apolloClient });
  const [addClient] = useMutation(ADD_CLIENT, { 
    client: apolloClient,
    update: (cache, { data: { addClient: newClient } }) => {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: clients.concat([newClient]) },
      });
    }
  });
    ;
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (name === '' || email === '' || phone === '') {
      return alert('Please fill all fields');
    }
  
    try {
      const result = await addClient({
        variables: {
          name: name,
          email: email,
          phone: phone
        }
      });
  
      // Handle the result here, check if the mutation was successful
      console.log('Mutation Result:', result);
  
      setName('');
      setEmail('');
      setPhone('');
      setShowModal(false);
    } catch (error) {
      // Handle errors from the mutation
      console.error('Mutation Error:', error);
      // Display an error message to the user if needed
      alert('Failed to add client. Please try again.');
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const { data: deletionData } = await deleteClient({ variables: { id } });

      await refetch();
    } catch (mutationError) {
      console.log("Mutation error:", mutationError);

    }
  };

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/login');
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  const clients = data?.clients || [];
  return (
    <ApolloProvider client={apolloClient}>

      <button
        type="button"
        className="btn btn-primary"

        data-bs-toggle="modal"
        data-bs-target="#addClientModal"
        onClick={() => setShowModal(true)}
      >
        <div className='d-flex align-items-center'>
          <FaUser className='icon' />
          <div>Add Client</div>

        </div>

      </button>


      <div className="modal fade" id="addClientModal" aria-labelledby="addClientModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addClientModalLabel">Add Client</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className='mb-3'>
                  <label className='form-label'>Name</label>
                  <input type="text"
                    className="form-control"
                    id="name"
                    value={name} onChange={(e) => setName(e.target.value)}

                  />


                  <label className='form-label'>Email</label>
                  <input type="text"
                    className="form-control"
                    id="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}

                  />


                  <label className='form-label'>Phone</label>
                  <input type="text"
                    className="form-control"
                    id="phone"
                    value={phone} onChange={(e) => setPhone(e.target.value)}

                  />

                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#4285f4',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '20px',
                    }}
                  >
                    Submit
                  </button>
                  <button
                     style={{
                      // backgroundColor: '#4285f4',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '20px',
                    }}
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal">
                    Close
                  </button>

                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
      <div>

        <table style={{
          fontFamily: 'Arial, sans-serif',
          borderCollapse: 'collapse',
          width: '100%',
          backgroundColor: '#f4f4f4'
        }}>
          <thead>
            <tr>
              <th style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: '#fff',
                fontSize: '1.5em',
                fontWeight: 'bold'
              }}>Name</th>
              <th style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: '#fff',
                fontSize: '1.5em',
                fontWeight: 'bold'
              }}>Email</th>
              <th style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: '#fff',
                fontSize: '1.5em',
                fontWeight: 'bold'
              }}>Phone</th>
              <th style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: '#fff',
                fontSize: '1.5em',
                fontWeight: 'bold'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: any) => (
              <tr key={client.id}>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{client.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{client.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{client.phone}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDelete(client.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={logout}
          style={{
            backgroundColor: '#4285f4',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Logout
        </button>
      </div>
    </ApolloProvider>
  );

};

export default GamesPage;
