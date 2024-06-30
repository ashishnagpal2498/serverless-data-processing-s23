import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CipherComponent = () => {
    const [cipher, setCipher] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCipherChallenge = async () => {
            const accessToken = localStorage.getItem('accessToken');

            try {
                const response = await axios.get('https://n5yo7phswm5fl6j2iud6djwslq0cgyyw.lambda-url.us-east-1.on.aws/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setCipher(response.data);

            } catch (error) {
                console.error('Error fetching cipher challenge', error);
                setError('Failed to fetch cipher challenge. Please try again.');
            }
        };

        fetchCipherChallenge();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post('https://auspiss5b7fd6np5llrsfbgdvu0ppeml.lambda-url.us-east-1.on.aws/', { answer: userAnswer },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },

                });

            if (response.data.success) {
                toast.success('Cipher challenge answered correctly!');
                setTimeout(() => {
                    navigate('/');
                }, 4000)

            } else {
                toast.error('Incorrect answer for the cipher challenge.');
            }
        } catch (error) {
            console.error('Error verifying cipher challenge', error);
            setError('Failed to verify cipher challenge. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Cipher Challenge</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <p className="mb-2"> Challenge {cipher.challenge}</p>
                <p className="mb-4"> Key {cipher.key}</p>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Your Answer:
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            required
                            className="block w-full p-2 border rounded mt-1"
                        />
                    </label>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">Submit</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CipherComponent;
