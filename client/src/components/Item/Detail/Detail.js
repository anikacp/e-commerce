import React, { useContext, useState, useEffect } from 'react';
import './Detail.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { CartItemsContext } from '../../../Context/CartItemsContext';
import { WishItemsContext } from '../../../Context/WishItemsContext';

const Detail = (props) => {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState(props.item.size[0]);
    const [recognitionActive, setRecognitionActive] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const cartItems = useContext(CartItemsContext);
    const wishItems = useContext(WishItemsContext);

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };

    const handelQuantityIncrement = () => {
        setQuantity((prev) => prev + 1);
    };

    const handelQuantityDecrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handelAddToCart = () => {
        cartItems.addItem(props.item, quantity, size);
    };

    const handelAddToWish = () => {
        wishItems.addItem(props.item);
    };

    const handleVoiceCommand = async (audioBlob) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64Data = reader.result.split(",")[1];

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

            const response = await fetch(
                "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "yBpv8lLtPZh0CaJleMk2b8l0lzqAUVHSDdgx7rVNfYJn-6_wO9pv_YDqpOj2y5cx",
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
            const transcript = data.pipelineResponse[1].output[0].target.toLowerCase();

            if (transcript.includes("bag")) {
                handelAddToCart();
            }
        };

        reader.readAsDataURL(audioBlob);
    };

    const startVoiceRecognition = async () => {
        if (!recognitionActive) {
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
                    const audioBlob = new Blob(chunks, { type: "audio/webm" });
                    handleVoiceCommand(audioBlob);
                });

                recorder.start();
                setMediaRecorder(recorder);
                setRecognitionActive(true);
            } catch (error) {
                console.error("Error recording voice:", error);
            }
        } else {
            mediaRecorder.stop();
            setRecognitionActive(false);
        }
    };

    return (
        <div className="product__detail__container">
            <div className="product__detail">
                <div className="product__main__detail">
                    <div className="product__name__main">{props.item.name}</div>
                    <div className="product__detail__description">{props.item.description}</div>
                    <div className="product__color">
                        <div className="product-color-label">COLOR</div>
                        <div className="product-color" style={{ backgroundColor: `${props.item.color}` }}></div>
                    </div>
                    <div className="product__price__detail">${props.item.price}</div>
                </div>
                <form className="product__form">
                    <div className="product__quantity__and__size">
                        <div className="product__quantity">
                            <IconButton onClick={handelQuantityIncrement}>
                                <AddCircleIcon />
                            </IconButton>
                            <div type="text" name="quantity" className="quantity__input">
                                {quantity}
                            </div>
                            <IconButton onClick={handelQuantityDecrement}>
                                <RemoveCircleIcon fontSize="medium" />
                            </IconButton>
                        </div>

                        <div className="product size">
                            <Box sx={{ minWidth: 100 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Size</InputLabel>
                                    <Select value={size} label="size" onChange={handleSizeChange}>
                                        {props.item.size.map((size) => (
                                            <MenuItem key={size} value={size}>
                                                {size}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                    </div>
                    <div className="collect__item__actions">
                        <div className="add__cart__add__wish">
                            <div className="add__cart">
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#FFE26E',
                                            borderColor: '#FFE26E',
                                            borderWidth: '3px',
                                            color: 'black',
                                        },
                                        minWidth: 200,
                                        borderColor: 'black',
                                        backgroundColor: 'black',
                                        color: '#FFE26E',
                                        borderWidth: '3px',
                                    }}
                                    onClick={handelAddToCart}
                                >
                                    ADD TO BAG
                                </Button>
                            </div>
                            <div className="add__wish">
                                <IconButton
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#FFE26E',
                                            borderColor: '#FFE26E',
                                            borderWidth: '3px',
                                            color: 'black',
                                        },
                                        borderColor: 'black',
                                        backgroundColor: 'black',
                                        color: '#FFE26E',
                                        borderWidth: '3px',
                                    }}
                                    onClick={handelAddToWish}
                                >
                                    <FavoriteBorderIcon sx={{ width: '22px', height: '22px' }} />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </form>
                <Button onClick={startVoiceRecognition}>
                    {recognitionActive ? 'Stop Voice Recognition' : 'Start Speaking Here'}
                </Button>
            </div>
        </div>
    );
};

export default Detail;
