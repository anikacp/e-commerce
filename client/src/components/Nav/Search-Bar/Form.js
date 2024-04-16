import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { SearchContext } from "../../../Context/SearchContext";
import PropTypes from "prop-types";
import "./Form.css";

const Form = ({ Lang, model }) => {
  const [searchInput, setSearchInput] = useState("");
  const [lang, setLang] = useState("hi");

  const searchContext = useContext(SearchContext);
  const [voiceActivated, setVoiceActivated] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    searchContext.setSearchQuery(searchInput);
    navigate("/search");
  };

  const handleVoiceButtonClick = async () => {
    console.log("play");

    if (!voiceActivated) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        recorder.addEventListener("stop", async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const reader = new FileReader();

          reader.onloadend = async () => {
            const base64Data = reader.result.split(",")[1];
            console.log(base64Data);

            const raw = JSON.stringify({
              pipelineTasks: [
                {
                  taskType: "asr",
                  config: {
                    language: {
                      sourceLanguage: "hi",
                    },
                    serviceId: "ai4bharat/conformer-hi-gpu--t4",
                    audioFormat: "flac",
                    samplingRate: 16000,
                  },
                },
                {
                  taskType: "translation",
                  config: {
                    language: {
                      sourceLanguage: "hi",
                      targetLanguage: "en",
                    },
                    serviceId: "ai4bharat/indictrans-v2-all-gpu--t4",
                  },
                },
              ],
              inputData: {
                audio: [
                  {
                    audioContent: base64Data,
                  },
                ],
              },
            });

            console.log(raw);

            const response = await fetch(
              "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "yBpv8lLtPZh0CaJleMk2b8l0lzqAUVHSDdgx7rVNfYJn-6_wO9pv_YDqpOj2y5cx",
                  userID: "88d299727de346108e615e167dcc158f",
                  ulcaApiKey: "44283f95b4-2cd5-4750-87ed-f18aca5b402e",
                },
                body: raw,
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log("API Response:", data);

            // Extract the translated text from the API response
            const translatedText = data.pipelineResponse[1].output[0].target;
            setSearchInput(translatedText);
          };

          reader.readAsDataURL(blob);
        });

        recorder.start();
        setMediaRecorder(recorder);
        setVoiceActivated(true);
      } catch (error) {
        console.error("Error recording voice:", error);
      }
    } else {
      console.log("pause");
      mediaRecorder.stop();
      setVoiceActivated(false);
    }
  };

  return (
    <>
      <form className="search__form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for products"
          className="search__form__input"
          value={searchInput}
          onChange={handleChange}
          required
        />

        <div className="voice__language__container">
          <MicIcon fontSize="medium" onClick={handleVoiceButtonClick} className={voiceActivated ? "active-mic" : ""} />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="marathi">Marathi</option>
          </select>
        </div>
      </form>
    </>
  );
};

Form.propTypes = {
  Lang: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
};

export default Form;
