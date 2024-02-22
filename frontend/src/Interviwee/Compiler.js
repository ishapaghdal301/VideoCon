import { useState, useEffect } from 'react';
import './test.css';
import Editor from "@monaco-editor/react";
import CompilerNav from './CompilerNav';
import axios from 'axios';


function Compiler({ selectedProblemId }) {
    const [userCode, setUserCode] = useState('');
    const [userLang, setUserLang] = useState("python3");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const options = {
        fontSize: fontSize
    }


    function compile() {
        setLoading(true);
        if (userCode === '') {
            return;
        }

        fetch('http://localhost:8000/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: userCode,
                language: userLang,
                input: userInput
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUserOutput(data.output);
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function clearOutput() {
        setUserOutput("");
    }

    function handleCodeChange(newValue) {
        setUserCode(newValue);
    }

    function handleInputChange(event) {
        const newInput = event.target.value;
        setUserInput(newInput);
    }

    const handleSubmitProblem = async () => {
        try {
          const response = await axios.post(`http://localhost:8000/api/submitproblem/${selectedProblemId}`);
        //   setSubmissionResponse(response.data);
        } catch (error) {
          console.error('Error submitting problem:', error);
        }
      };

    return (
        <div className="App">
            <CompilerNav
                userLang={userLang} setUserLang={setUserLang}
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}
            />
            <div className="main">
                <div className="left-container">
                    <Editor
                        value={userCode}
                        options={options}
                        height="calc(100vh - 50px)"
                        width="100%"
                        theme={userTheme}
                        language={userLang}
                        defaultValue="# Enter your code here"
                        onChange={handleCodeChange}
                    />
                    <button onClick={handleSubmitProblem}>Submit</button>
                    <button className="run-btn" onClick={() => compile()}>
                        Run
                    </button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea 
                            id="code-inp" 
                            value={userInput} 
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box">
                            Loading...
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre>{userOutput}</pre>
                            <button onClick={() => clearOutput()} className="clear-btn">
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Compiler;
