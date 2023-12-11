"use client"
import { useRouter } from 'next/navigation';
import { GET_PROJECT } from '@/queries/projects';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { FaPhone, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import apolloClient from '../../../../../apollo-client';

export default function Project() {
    const router = useRouter();
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_PROJECT, {
        client: apolloClient,
        variables: { id: id },
    });
    let clientInfoStyle = {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '2.5rem',
        marginLeft: '8rem',
        marginRight: '8rem',
        marginBottom: '20px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '16px'
    };

    let projectStyle = {
        marginLeft: '8rem',
        marginTop: '3rem'

    }

    let iconStyle = {
        marginRight: '5px',
        verticalAlign: 'middle',
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    if (!data || !data.project) {
        return <p>No project data found</p>;
    }
    let clientInfo = null;
    if (data.project.client && typeof data.project.client === 'object') {

        clientInfo = (
            <div style={clientInfoStyle}>
                <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '3rem' }}>Client Information</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                        <FaIdBadge className='icon' style={iconStyle} />
                        <span style={{ marginLeft: '5px' }}>{data.project.client.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                        <FaEnvelope className='icon' style={iconStyle} />
                        <span style={{ marginLeft: '5px' }}>{data.project.client.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaPhone className='icon' style={iconStyle} />
                        <span style={{ marginLeft: '5px' }}>{data.project.client.phone}</span>
                    </div>
                </div>


            </div>
        );
    }

    return (
        <>
            <div style={{ marginLeft: '8rem' }}> 
                <button
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        backgroundColor: '#3498db',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        marginTop: '1rem'
                    }}
                    onClick={() => router.push('/profile')} 
                >
                    Back to Profile
                </button>
            </div>
            <div style={projectStyle} >

                <h1 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '2rem',textTransform: 'uppercase' }}>{data.project.name}</h1>

                <p>{data.project.description}</p>
                <h5 style={{ fontWeight: '600', marginBottom: '1.5rem', fontSize:'14px', marginTop:'1rem' }}>Project Status : {data.project.status}</h5>
    
            </div>

            <p>     {clientInfo}</p>

        </>
    );
}
