import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';

const SecurityQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const accessToken = localStorage.getItem('accessToken');
      console.log("userToken ---> ",accessToken)
      try {
        const response = await axios.get('https://qktdhiu7svvlyg5axzvxy375pe0hsiwy.lambda-url.us-east-1.on.aws/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setQuestions(response.data.securityQuestions);
      } catch (error) {
        console.error('Error fetching security questions', error);
        setError('Failed to fetch security questions. Please try again.');
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    const userAnswers = questions.map((question, index) => ({
      question: question.question,
      answer: CryptoJS.SHA256(answers[index]).toString()
    }));

    try {
      const response = await axios.post('https://mhblpkavnwk33ac4op6lj3zklq0fvszi.lambda-url.us-east-1.on.aws/', {
        answers:userAnswers
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
    });
        console.log(response)
      if (response.status === 200) {
        toast.success('Security questions answered correctly!');
      } else {
        
      }
    } catch (error) {
        console.error('Error verifying security answers', error);
        if(error.response.status === 400){
            toast.error('Incorrect answers to security questions.');
        }
        else
            toast.error('Failed to verify answers. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Answer Security Questions</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((question, index) => (
            <div key={index}>
              <label className="block text-gray-700">{question.question}</label>
              <input
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit Answers</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SecurityQuestions;
