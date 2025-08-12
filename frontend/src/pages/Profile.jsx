import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import axios from "axios";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "./SignUp.css"; // uses your main theme!
import { FaMapMarkerAlt, FaPhoneAlt, FaBuilding, FaUser, FaIdBadge } from "react-icons/fa";

const initialCustomer = {
  phone: "",
  photo: null,
  address: "",
};
const initialBusiness = {
  phone: "",
  gst: "",
  photo: null,
  businessName: "",
  address: "",
};

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ⬅ get query params
  const isCustomer = searchParams.get("isCustomer") === "true"; // ⬅ read from query param
  const canvasRef = useRef(null);

  // Load CSRF token on mount
  useEffect(() => {
    const cookies = async () => {
      try {
        await axios.get("http://localhost:8000/api/auth/csrf", {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    cookies();
  }, []);

  // 3D background
  useEffect(() => {
    let scene, camera, renderer, particles, animationId;
    const initThreeJS = () => {
      if (!canvasRef.current) return;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(400, 400);
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);

      // Animate geometry shapes (cute)
      const shapes = [];
      const geometries = [
        new THREE.TetrahedronGeometry(0.5),
        new THREE.OctahedronGeometry(0.4),
        new THREE.IcosahedronGeometry(0.3),
      ];
      for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x4ecdc4 : 0xff6b6b,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const shape = new THREE.Mesh(geometry, material);
        shape.position.x = (Math.random() - 0.5) * 8;
        shape.position.y = (Math.random() - 0.5) * 8;
        shape.position.z = (Math.random() - 0.5) * 8;
        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;
        shapes.push(shape);
        scene.add(shape);
      }
      // Particles
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 150;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 12;
      }
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x4ecdc4,
        size: 0.03,
        transparent: true,
        opacity: 0.4,
      });
      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      camera.position.z = 6;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        shapes.forEach((shape, index) => {
          shape.rotation.x += 0.005 + index * 0.001;
          shape.rotation.y += 0.008 + index * 0.001;
          const time = Date.now() * 0.001;
          shape.position.y += Math.sin(time + index) * 0.002;
        });
        if (particles) {
          particles.rotation.y += 0.001;
          particles.rotation.x += 0.0005;
        }
        renderer.render(scene, camera);
      };
      animate();
    };
    initThreeJS();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
    };
  }, []);

  // Theme toggling
  const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains("dark"));
  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [isDarkMode]);

  // Form state
  const [formData, setFormData] = useState(isCustomer ? initialCustomer : initialBusiness);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // update fields as role changes
  useEffect(() => {
    setFormData(isCustomer ? initialCustomer : initialBusiness);
    setErrors({});
  }, [isCustomer]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // UI fields for profile completion based on user type
  const customerFields = [
    {
      label: "Phone Number",
      id: "phone",
      type: "tel",
      icon: <FaPhoneAlt style={{ color: "#4ecdc4" }} />,
      placeholder: "Enter your phone number",
    },
    {
      label: "Profile Picture",
      id: "photo",
      type: "file",
      icon: <FaUser style={{ color: "#4ecdc4" }} />,
      accept: "image/*",
      isFile: true,
    },
    {
      label: "Address",
      id: "address",
      type: "text",
      icon: <FaMapMarkerAlt style={{ color: "#4ecdc4" }} />,
      placeholder: "Enter your address",
    },
  ];

  const businessFields = [
    {
      label: "Phone Number",
      id: "phone",
      type: "tel",
      icon: <FaPhoneAlt style={{ color: "#4ecdc4" }} />,
      placeholder: "Enter your phone number",
    },
    {
      label: "GST Number",
      id: "gst",
      type: "text",
      icon: <FaIdBadge style={{ color: "#4ecdc4" }} />,
      placeholder: "Enter GSTIN",
    },
    {
      label: "Profile Picture",
      id: "photo",
      type: "file",
      icon: <FaUser style={{ color: "#4ecdc4" }} />,
      accept: "image/*",
      isFile: true,
    },
    {
      label: "Business Name",
      id: "businessName",
      type: "text",
      icon: <FaBuilding style={{ color: "#4ecdc4" }} />,
      placeholder: "Enter your business name",
    },
    {
      label: "Business Address",
      id: "address",
      type: "text",
      icon: <FaMapMarkerAlt style={{ color: "#4ecdc4" }} />,
      placeholder: "Enter your business address",
    },
  ];

  // Validation logic
  function validate() {
    const newErrors = {};

    // Universal: phone is required, 10 digits
    if (!formData.phone || !/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // Address required
    if (!formData.address || formData.address.trim().length < 7) {
      newErrors.address = "Enter your full address";
    }

    // Photo required
    if (!formData.photo) {
      newErrors.photo = "Please upload a profile picture";
    }

    if (!isCustomer) {
      // Business fields required
      if (!formData.businessName || formData.businessName.trim().length < 2) {
        newErrors.businessName = "Business Name is required";
      }
      if (!formData.gst || !/^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1})$/.test(formData.gst.trim())) {
        newErrors.gst = "Enter valid GSTIN (15 chars, Eg: 27ABCDE1234F2Z5)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Submission handler
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const csrfToken = getCookie("csrftoken");

      const apiURL = "http://localhost:8000/api/auth/profile/complete/";

      await axios.post(
        apiURL,
        {
          name: formData.name || "John Doe", // fallback for demo
          phone: formData.phone,
          address: formData.address,
          is_customer: isCustomer,
          business_name: formData.businessName,
          gst_number: formData.gst
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
            // Don't manually set sessionid here — cookies handle it
          },
          withCredentials: true // sends sessionid cookie from browser
        }
      );

      alert("Profile Completed! Redirecting…");
      if (isCustomer) {
        navigate("/customerDashboard");
      } else {
        navigate("/sellerDashboard");
      }
    } catch (err) {
      if (err.response?.data) {
        const errFields = {};
        for (const [k, v] of Object.entries(err.response.data)) {
          errFields[k] = Array.isArray(v) ? v[0] : v;
        }
        setErrors(errFields);
      } else {
        alert("An error occurred. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }


  // handle file input (profile picture)
  function handleFileInput(e) {
    const [file] = e.target.files;
    handleChange("photo", file);
  }

  // keyboard enter handler
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Demo navbar/structure/theme toggle, as per your original code
  const handleNavigation = (page) => {
    if (page === 'home') alert('Redirecting to Home page...');
    else if (page === 'about') alert('About Us...');
    else if (page === 'contact') alert('Contact info...');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RentalHub</div>
          <div className="nav-right">
            <ul className="nav-links">
              <li><a href="#home" onClick={e => { e.preventDefault(); handleNavigation('home'); }}>Home</a></li>
              <li><a href="#about" onClick={e => { e.preventDefault(); handleNavigation('about'); }}>About</a></li>
              <li><a href="#contact" onClick={e => { e.preventDefault(); handleNavigation('contact'); }}>Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Profile Completion Form */}
      <section className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title" style={{ fontSize: "2.3rem" }}>
            {/* Emoji or Fa-user */}
            {isCustomer ? "Complete Your Profile (Customer)" : "Complete Your Profile (Business)"}
          </h1>
          <p className="signup-subtitle" style={{ marginBottom: 14 }}>
            {isCustomer
              ? "We need a few more details to personalize your account and enable customer services."
              : "Complete your business details to activate your RentalHub merchant account."}
          </p>

          <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: 0 }}>
            {(isCustomer ? customerFields : businessFields).map(field => (
              <div className="form-group" key={field.id}>
                <label className="form-label" htmlFor={field.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {field.icon}
                  {field.label}
                </label>
                {field.isFile ? (
                  <input
                    className={`form-input ${errors[field.id] ? "error" : ""}`}
                    id={field.id}
                    type="file"
                    accept={field.accept}
                    onChange={handleFileInput}
                  />
                ) : (
                  <input
                    className={`form-input ${errors[field.id] ? "error" : ""}`}
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete="off"
                    value={formData[field.id] ?? ""}
                    onChange={e => handleChange(field.id, e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                )}
                {errors[field.id] && <span className="error-message">{errors[field.id]}</span>}
              </div>
            ))}

            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
              style={{ marginTop: 10 }}
            >
              {isLoading ? "Saving..." : "Submit Profile"}
            </button>
          </form>

          {/* 3D Canvas: visually hidden */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <div ref={canvasRef}></div>
          </div>
        </div>
      </section>

      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <div
          className="swipe-toggle"
          onClick={() => setIsDarkMode(v => !v)}
          title="Toggle Theme"
        >
          <div className="toggle-slider">
            <span className="toggle-icon">{isDarkMode ? "🌙" : "☀️"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
