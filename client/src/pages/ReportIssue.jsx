import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/react";

function ReportIssue() {
    const { user } = useUser();

    // ========================================
    // FORM STATE
    // ========================================

    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    // ========================================
    // CAMERA STATE
    // ========================================

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // ========================================
    // UI STATE
    // ========================================

    const [locationLoading, setLocationLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // ========================================
    // START CAMERA
    // ========================================

    const startCamera = async () => {
        setError("");
        setMessage("");

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                setError(
                    "Camera access is not supported by this browser."
                );
                return;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: "environment",
                        },
                        width: {
                            ideal: 1280,
                        },
                        height: {
                            ideal: 720,
                        },
                    },
                    audio: false,
                });

            setCameraStream(stream);
            setCameraOpen(true);

        } catch (err) {
            console.error("Camera error:", err);

            if (
                err.name === "NotAllowedError"
            ) {
                setError(
                    "Camera permission was denied. Please allow camera access in your browser."
                );
            } else if (
                err.name === "NotFoundError"
            ) {
                setError(
                    "No camera was found on this device."
                );
            } else {
                setError(
                    "Unable to open the camera. Please check your camera permissions."
                );
            }
        }
    };


    // ========================================
    // CONNECT STREAM TO VIDEO
    // ========================================

    useEffect(() => {
        if (
            cameraOpen &&
            cameraStream &&
            videoRef.current
        ) {
            videoRef.current.srcObject =
                cameraStream;

            videoRef.current.play().catch(
                (err) => {
                    console.error(
                        "Video play error:",
                        err
                    );
                }
            );
        }
    }, [cameraOpen, cameraStream]);


    // ========================================
    // STOP CAMERA
    // ========================================

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });
        }

        setCameraStream(null);
        setCameraOpen(false);
    };


    // ========================================
    // CAPTURE PHOTO
    // ========================================

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            setError(
                "Camera is not ready yet."
            );
            return;
        }

        if (
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            setError(
                "Camera is still loading. Please try again."
            );
            return;
        }


        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;


        // Draw current camera frame
        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Convert image to Blob
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setError(
                        "Unable to capture photo."
                    );
                    return;
                }


                const file = new File(
                    [blob],
                    `civicpulse-${Date.now()}.jpg`,
                    {
                        type: "image/jpeg",
                    }
                );


                setImage(file);

                const previewUrl =
                    URL.createObjectURL(file);

                setImagePreview(
                    previewUrl
                );


                // Close camera
                stopCamera();

                setMessage(
                    "Photo captured successfully."
                );

                setError("");
            },
            "image/jpeg",
            0.9
        );
    };


    // ========================================
    // RETAKE PHOTO
    // ========================================

    const retakePhoto = () => {
        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImage(null);
        setImagePreview("");

        setMessage("");
        setError("");

        startCamera();
    };


    // ========================================
    // REMOVE PHOTO
    // ========================================

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImage(null);
        setImagePreview("");

        setMessage("");
    };


    // ========================================
    // GET USER LOCATION
    // ========================================

    const getLocation = () => {
        setError("");
        setMessage("");

        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(
                    position.coords.latitude
                );

                setLongitude(
                    position.coords.longitude
                );

                setLocationLoading(false);

                setMessage(
                    "Location captured successfully."
                );
            },

            (err) => {
                console.error(
                    "Location error:",
                    err
                );

                setLocationLoading(false);

                setError(
                    "Unable to get your location. Please allow location access."
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };


    // ========================================
    // SUBMIT COMPLAINT
    // ========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");


        // ----------------------------------------
        // CHECK USER
        // ----------------------------------------

        if (!user?.id) {
            setError(
                "Unable to identify your account. Please sign in again."
            );
            return;
        }


        // ----------------------------------------
        // CHECK DESCRIPTION
        // ----------------------------------------

        if (!description.trim()) {
            setError(
                "Please describe the issue."
            );
            return;
        }


        // ----------------------------------------
        // CHECK LOCATION
        // ----------------------------------------

        if (
            latitude === "" ||
            longitude === ""
        ) {
            setError(
                "Please get your location before submitting."
            );
            return;
        }


        try {
            setSubmitting(true);


            // ====================================
            // CREATE FORM DATA
            // ====================================

            const formData = new FormData();


            formData.append(
                "userId",
                user.id
            );


            formData.append(
                "description",
                description.trim()
            );


            formData.append(
                "category",
                category || "other"
            );


            formData.append(
                "latitude",
                String(latitude)
            );


            formData.append(
                "longitude",
                String(longitude)
            );


            // ====================================
            // ADD PHOTO
            // ====================================

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }


            // ====================================
            // SEND TO SERVER
            // ====================================

            const response = await fetch(
                "http://localhost:5001/api/complaints",
                {
                    method: "POST",
                    body: formData,
                }
            );


            const data =
                await response.json();


            // ====================================
            // HANDLE ERROR
            // ====================================

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to submit complaint"
                );
            }


            // ====================================
            // SUCCESS
            // ====================================

            setMessage(
                "Complaint submitted successfully!"
            );


            // Clear form
            setDescription("");
            setCategory("");

            setLatitude("");
            setLongitude("");

            removeImage();


        } catch (err) {
            console.error(
                "Complaint submission error:",
                err
            );

            setError(
                err.message ||
                "Unable to submit complaint."
            );

        } finally {
            setSubmitting(false);
        }
    };


    // ========================================
    // CLEAN UP CAMERA WHEN PAGE CLOSES
    // ========================================

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });
            }

            if (imagePreview) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };
    }, []);


    // ========================================
    // PAGE
    // ========================================

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                {/* ==================================
                    TITLE
                ================================== */}

                <h1 style={styles.title}>
                    Report an Issue
                </h1>


                <p style={styles.subtitle}>
                    Help improve your community by
                    reporting a civic problem.
                </p>


                <form onSubmit={handleSubmit}>


                    {/* ==================================
                        PHOTO EVIDENCE
                    ================================== */}

                    <label style={styles.label}>
                        Photo Evidence
                    </label>


                    {/* ==================================
                        CAMERA VIEW
                    ================================== */}

                    {cameraOpen && (

                        <div style={styles.cameraContainer}>

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={styles.video}
                            />


                            <div
                                style={
                                    styles.cameraOverlay
                                }
                            >
                                <div
                                    style={
                                        styles.cameraGuide
                                    }
                                />
                            </div>


                            <div
                                style={
                                    styles.cameraControls
                                }
                            >

                                <button
                                    type="button"
                                    onClick={
                                        stopCamera
                                    }
                                    style={
                                        styles.cancelCameraButton
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        capturePhoto
                                    }
                                    style={
                                        styles.captureButton
                                    }
                                    aria-label="Capture photo"
                                >
                                    <span
                                        style={
                                            styles.captureCircle
                                        }
                                    />
                                </button>


                                <div
                                    style={
                                        styles.cameraSpacer
                                    }
                                />

                            </div>

                        </div>

                    )}


                    {/* ==================================
                        TAKE PHOTO BUTTON
                    ================================== */}

                    {!cameraOpen &&
                        !imagePreview && (

                            <button
                                type="button"
                                onClick={
                                    startCamera
                                }
                                style={
                                    styles.takePhotoButton
                                }
                            >

                                <span
                                    style={
                                        styles.cameraIcon
                                    }
                                >
                                    📷
                                </span>


                                <span>
                                    <strong>
                                        Take Photo
                                    </strong>

                                    <small
                                        style={
                                            styles.photoHint
                                        }
                                    >
                                        Open camera and
                                        capture evidence
                                    </small>
                                </span>

                            </button>

                        )}


                    {/* ==================================
                        PHOTO PREVIEW
                    ================================== */}

                    {imagePreview && (

                        <div
                            style={
                                styles.previewContainer
                            }
                        >

                            <img
                                src={
                                    imagePreview
                                }
                                alt="Civic issue evidence"
                                style={
                                    styles.previewImage
                                }
                            />


                            <div
                                style={
                                    styles.previewInfo
                                }
                            >

                                <div
                                    style={
                                        styles.photoCaptured
                                    }
                                >
                                    ✓ Photo captured
                                </div>


                                <div
                                    style={
                                        styles.photoActions
                                    }
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            retakePhoto
                                        }
                                        style={
                                            styles.retakeButton
                                        }
                                    >
                                        📷 Retake
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            removeImage
                                        }
                                        style={
                                            styles.removeButton
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ==================================
                        HIDDEN CANVAS
                    ================================== */}

                    <canvas
                        ref={canvasRef}
                        style={{
                            display: "none",
                        }}
                    />


                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <label style={styles.label}>
                        Describe the issue
                    </label>


                    <textarea
                        value={
                            description
                        }
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        placeholder="Example: Large pothole near the college gate..."
                        rows="5"
                        style={
                            styles.textarea
                        }
                    />


                    {/* ==================================
                        CATEGORY
                    ================================== */}

                    <label style={styles.label}>
                        Category
                    </label>


                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                        style={
                            styles.input
                        }
                    >

                        <option value="">
                            Select a category
                        </option>

                        <option value="road_damage">
                            Road Damage
                        </option>

                        <option value="water_leakage">
                            Water Leakage
                        </option>

                        <option value="garbage">
                            Garbage
                        </option>

                        <option value="streetlight">
                            Streetlight
                        </option>

                        <option value="drainage">
                            Drainage
                        </option>

                        <option value="other">
                            Other
                        </option>

                    </select>


                    {/* ==================================
                        LOCATION
                    ================================== */}

                    <label style={styles.label}>
                        Location
                    </label>


                    <button
                        type="button"
                        onClick={
                            getLocation
                        }
                        style={
                            styles.locationButton
                        }
                        disabled={
                            locationLoading
                        }
                    >

                        {locationLoading
                            ? "Getting Location..."
                            : "📍 Use My Location"}

                    </button>


                    {/* ==================================
                        LOCATION INFO
                    ================================== */}

                    {latitude &&
                        longitude && (

                            <div
                                style={
                                    styles.locationBox
                                }
                            >

                                <div>
                                    <strong>
                                        Latitude:
                                    </strong>{" "}
                                    {Number(
                                        latitude
                                    ).toFixed(
                                        6
                                    )}
                                </div>


                                <div>
                                    <strong>
                                        Longitude:
                                    </strong>{" "}
                                    {Number(
                                        longitude
                                    ).toFixed(
                                        6
                                    )}
                                </div>

                            </div>

                        )}


                    {/* ==================================
                        SUBMIT
                    ================================== */}

                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
                        style={{
                            ...styles.submitButton,
                            opacity:
                                submitting
                                    ? 0.7
                                    : 1,
                        }}
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Complaint"}

                    </button>


                    {/* ==================================
                        SUCCESS
                    ================================== */}

                    {message && (

                        <p
                            style={
                                styles.success
                            }
                        >
                            {message}
                        </p>

                    )}


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {error && (

                        <p
                            style={
                                styles.error
                            }
                        >
                            {error}
                        </p>

                    )}

                </form>

            </div>

        </div>
    );
}


// ============================================
// STYLES
// ============================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
        boxSizing: "border-box",
    },


    card: {
        maxWidth: "700px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "32px",
        borderRadius: "16px",
        boxShadow:
            "0 4px 20px rgba(0, 0, 0, 0.08)",
        boxSizing: "border-box",
    },


    title: {
        margin: "0 0 8px",
        fontSize: "32px",
        color: "#0f172a",
    },


    subtitle: {
        marginBottom: "30px",
        color: "#64748b",
        lineHeight: "1.6",
    },


    label: {
        display: "block",
        marginBottom: "8px",
        marginTop: "20px",
        fontWeight: "600",
        color: "#334155",
    },


    // ========================================
    // CAMERA
    // ========================================

    cameraContainer: {
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        background: "#000000",
    },


    video: {
        width: "100%",
        height: "420px",
        display: "block",
        objectFit: "cover",
        background: "#000000",
    },


    cameraOverlay: {
        position: "absolute",
        inset: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
    },


    cameraGuide: {
        width: "75%",
        height: "70%",
        border: "2px solid rgba(255,255,255,0.7)",
        borderRadius: "16px",
        boxSizing: "border-box",
    },


    cameraControls: {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background:
            "linear-gradient(transparent, rgba(0,0,0,0.75))",
    },


    captureButton: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        border: "4px solid #ffffff",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: "4px",
    },


    captureCircle: {
        display: "block",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "#ffffff",
    },


    cancelCameraButton: {
        border: "none",
        background: "rgba(0,0,0,0.6)",
        color: "#ffffff",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },


    cameraSpacer: {
        width: "75px",
    },


    // ========================================
    // TAKE PHOTO
    // ========================================

    takePhotoButton: {
        width: "100%",
        minHeight: "120px",
        border: "2px dashed #94a3b8",
        borderRadius: "12px",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        cursor: "pointer",
        color: "#2563eb",
        fontSize: "16px",
    },


    cameraIcon: {
        fontSize: "34px",
    },


    photoHint: {
        display: "block",
        marginTop: "4px",
        color: "#64748b",
        fontSize: "13px",
        fontWeight: "400",
    },


    // ========================================
    // PREVIEW
    // ========================================

    previewContainer: {
        marginTop: "16px",
        padding: "12px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        background: "#ffffff",
    },


    previewImage: {
        width: "100%",
        maxHeight: "360px",
        objectFit: "cover",
        borderRadius: "8px",
        display: "block",
    },


    previewInfo: {
        marginTop: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
    },


    photoCaptured: {
        color: "#166534",
        fontWeight: "600",
        fontSize: "14px",
    },


    photoActions: {
        display: "flex",
        gap: "10px",
    },


    retakeButton: {
        border: "1px solid #2563eb",
        background: "#ffffff",
        color: "#2563eb",
        padding: "8px 12px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600",
    },


    removeButton: {
        border: "1px solid #fecaca",
        background: "#fff1f2",
        color: "#dc2626",
        padding: "8px 12px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600",
    },


    // ========================================
    // FORM
    // ========================================

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        resize: "vertical",
        fontFamily: "inherit",
        outline: "none",
    },


    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        background: "#ffffff",
        outline: "none",
    },


    // ========================================
    // LOCATION
    // ========================================

    locationButton: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #2563eb",
        background: "#ffffff",
        color: "#2563eb",
        fontWeight: "600",
        cursor: "pointer",
    },


    locationBox: {
        marginTop: "12px",
        padding: "12px",
        borderRadius: "8px",
        background: "#eff6ff",
        color: "#1e40af",
        fontSize: "14px",
        lineHeight: "1.8",
    },


    // ========================================
    // SUBMIT
    // ========================================

    submitButton: {
        width: "100%",
        marginTop: "24px",
        padding: "14px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },


    // ========================================
    // MESSAGES
    // ========================================

    success: {
        marginTop: "16px",
        padding: "12px",
        borderRadius: "8px",
        background: "#dcfce7",
        color: "#166534",
    },


    error: {
        marginTop: "16px",
        padding: "12px",
        borderRadius: "8px",
        background: "#fee2e2",
        color: "#991b1b",
    },
};


export default ReportIssue;