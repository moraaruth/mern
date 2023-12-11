"use client"
import { useQuery } from '@apollo/client';
import { gql, useMutation } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../../../../apollo-client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaTrash, FaUser } from 'react-icons/fa'
import { GET_CLIENTS } from '../../queries/clients'
import { GET_PROJECTS, GET_PROJECT } from '../../queries/projects'
import { DELETE_CLIENT, ADD_CLIENT } from '../../mutations/clientMutation'
import Link from "next/link";
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { cache } from '@babel/traverse';



const GamesPage = () => {
  const { loading: clientsLoading, error: clientsError, data: clientsData, refetch: refetchClients }
    = useQuery(GET_CLIENTS, { client: apolloClient });
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
  const { loading: projectsLoading, error: projectsError, data: projectsData, refetch: refetchProjects } = useQuery(GET_PROJECTS, { client: apolloClient });
  const { data: projectData, refetch: refetchProject } = useQuery(GET_PROJECT, { client: apolloClient });


  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);


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

      console.log('Mutation Result:', result);

      setName('');
      setEmail('');
      setPhone('');
      setShowModal(false);
    } catch (error) {

      console.error('Mutation Error:', error);

      alert('Failed to add client. Please try again.');
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const { data: deletionData } = await deleteClient({ variables: { id } });

      await refetchClients();
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

  if (clientsLoading) return <p>Loading...</p>;
  if (clientsError) return <p>Something went wrong</p>;
  if (projectsLoading) return <p>Loading...</p>;
  if (projectsError) return <p>Something went wrong</p>;

  const clients = clientsData?.clients || [];
  console.log('Project Data:', projectData);
  const handleProjectSelection = (project: any) => {
    const projectId = project.id;

    router.push(`/profile/${projectId}`);
  };
  return (

    <ApolloProvider client={apolloClient}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginLeft: '3rem', marginTop: '1.5rem' }}>Welcome to Havanna!</h1>

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
            marginRight: '1rem'
          }}
        >
          Logout
        </button>
      </div>




      <div className='container' style={{


        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        marginLeft: '30px',
        marginTop: '20px',
      }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginBottom: '30px' }}
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



          {projectsData.projects.map((project: any) => (
            <tr
              key={project.id}
              style={{
                border: '1px solid #ccc',
                marginBottom: '35px',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <td style={{ borderRight: '1px solid #ccc', padding: '8px' }}>{project.name}</td>
              <td style={{ padding: '15px' }}>
                <button
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    backgroundColor: '#3498db',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  data-bs-toggle='modal'
                  data-bs-target='#projectModal'
                  onClick={() => handleProjectSelection(project)}
                >
                  View
                </button>
              </td>
              <td style={{ padding: '18px' }}>
                <p style={{ fontSize: '12px', marginTop: '15px' }}>
                  Status: <strong>{project.status}</strong>
                </p>
              </td>
            </tr>
          ))}


          <table style={{
            fontFamily: 'Arial, sans-serif',
            borderCollapse: 'collapse',
            width: '100%',
            backgroundColor: '#f4f4f4',
            marginTop: '30px'
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

        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          &copy; {new Date().getFullYear()} Havanna. All Rights Reserved.
        </p>
      </footer>

    </ApolloProvider>

  );

};

export default GamesPage;
